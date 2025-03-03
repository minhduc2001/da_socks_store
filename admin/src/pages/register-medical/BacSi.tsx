import ApiAppointment, { AppointmentStatus, IAppointment } from '@/api/ApiAppointment';
import { IUsedTypeService } from '@/api/ApiService';
import { InputSearchGlobal } from '@/components/AntdGlobal'
import ModalAlowAppointment from '@/components/ModalGlobal/ModalAlowAppointment';
import ModalAppointment from '@/components/ModalGlobal/ModalAppointment';
import ModalCreateEditLichHen from '@/components/ModalGlobal/ModalCreateEditLichHen';
import Notification from '@/components/Notification';
import TableGlobal, { IChangeTable, TABLE_DEFAULT_VALUE } from '@/components/TableGlobal';
import { getSocket } from '@/redux/slices/socketService';
import { disconnectSocket } from '@/redux/slices/SocketSlice';
import { IRootState } from '@/redux/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Checkbox, DatePicker, Popconfirm, Row, Space, Tag, TimePicker } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { LuClipboardEdit } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaHistory } from "react-icons/fa";

function BacSi() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [listParams, setListParams] = useState<Query>({
        page: 1,
        limit: TABLE_DEFAULT_VALUE.defaultPageSize,
    });
    const [selected, setSelected] = useState<any>();

    const handleCloseModal = () => {
        setSelected(undefined);
        setIsOpenModal(false);
    };

    const { data, refetch } = useQuery(
        ["get_appointments_bacsi", listParams],
        () => ApiAppointment.listBS(listParams),
        {
            keepPreviousData: true,
        }
    );

    const khamMutation = useMutation(ApiAppointment.kham)

    const handleChangeTable = (value: IChangeTable) => {
        setListParams((prev) => ({
            ...prev,
            page: value.page,
            limit: value.pageSize,
        }));
    };


    useEffect(() => {
        const socket = getSocket()
        if (socket) socket.on('reload', (v) => {
            refetch()
        })
    }, [])

    const navigate = useNavigate()

    const columns: ColumnsType<IAppointment> = [
        {
            title: "Mã",
            align: "center",
            width: 80,
            render: (_, record) => 'K' + record.id,
        },
        {
            title: "Tên bệnh nhân",
            dataIndex: ['patient', "full_name"],
            align: "center",
            width: 100,
        },
        {
            title: "Ngày sinh",
            dataIndex: ['patient', "birthday"],
            align: "center",
            width: 100,
            render: (value) => moment(value).format('DD/MM/YYYY')
        },
        {
            title: "Số điện thoại",
            dataIndex: ['patient', "phone"],
            align: "center",
            width: 100,
        },
        {
            title: "Địa chỉ",
            align: "center",
            width: 100,
            render: (_, record) => `${record?.patient?.wards?.name} ${record?.patient?.district?.name} ${record?.patient?.province?.name}`
        },
        {
            title: "Khám",
            dataIndex: 'used_type_services',
            align: "center",
            width: 100,
            render: (value: IUsedTypeService[]) => {
                return (
                    <ul>
                        {value?.map(v => <li>{v?.type_service?.name}</li>)}
                    </ul>
                )

            }
        },
        {
            title: "Lý do khám",
            dataIndex: ['symptoms'],
            align: "center",
            width: 100,
        },
        {
            title: 'Hành động',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (_, record) => {
                return (
                    <div>
                        <Popconfirm
                            title="Khám bệnh nhân này?"
                            onConfirm={() => {
                                khamMutation.mutate({ id: record.id }, {
                                    onSuccess() {
                                        refetch();
                                    }
                                })
                            }}
                            onCancel={() => { }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type='text'><FaEdit /></Button>
                        </Popconfirm>
                    </div>
                )
            }
        }
        // {
        //     title: "Trạng thái",
        //     dataIndex: 'status',
        //     align: "center",
        //     width: 100,
        // },
    ];

    const columns1: ColumnsType<IAppointment> = [
        {
            title: "Mã",
            align: "center",
            width: 80,
            render: (_, record) => 'K' + record.id,
        },
        {
            title: "Tên bệnh nhân",
            dataIndex: ['patient', "full_name"],
            align: "center",
            width: 100,
        },
        {
            title: "Ngày sinh",
            dataIndex: ['patient', "birthday"],
            align: "center",
            width: 100,
            render: (value) => moment(value).format('DD/MM/YYYY')
        },
        {
            title: "Số điện thoại",
            dataIndex: ['patient', "phone"],
            align: "center",
            width: 100,
        },
        {
            title: "Địa chỉ",
            align: "center",
            width: 100,
            render: (_, record) => `${record?.patient?.wards?.name} ${record?.patient?.district?.name} ${record?.patient?.province?.name}`
        },
        {
            title: "Khám",
            dataIndex: 'used_type_services',
            align: "center",
            width: 100,
            render: (value: IUsedTypeService[]) => {
                return (
                    <ul>
                        {value?.map(v => <li>{v?.type_service?.name}</li>)}
                    </ul>
                )

            }
        },
        {
            title: "Lý do khám",
            dataIndex: ['symptoms'],
            align: "center",
            width: 100,
        },
        {
            title: 'Hành động',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (_, record) => {
                return (
                    <div>
                        <Button type='text' onClick={() => {
                            setSelected(record);
                            setIsOpenModal(true)
                        }}><LuClipboardEdit /></Button>
                        <Button type='text' onClick={() => {
                            navigate('/kham-benh/' + record.patient.id)
                        }}><FaHistory /></Button>
                    </div>
                )
            }
        }
        // {
        //     title: "Trạng thái",
        //     dataIndex: 'status',
        //     align: "center",
        //     width: 100,
        // },
    ];


    return (
        <div>
            <div className='h-[400px]'>
                <div className='font-bold text-xl'>Chờ khám</div>
                <TableGlobal
                    total={data?.metadata?.totalItems}
                    dataSource={data?.results.filter(v => v.status == AppointmentStatus.Waitting)}
                    columns={columns}
                    onChangeTable={handleChangeTable}
                    className='no-footer-table'
                    scroll={{ y: 300 }}
                // scrollX={1200}
                />

            </div>

            <div className='font-bold text-xl'>Đang khám</div>
            <TableGlobal
                total={data?.metadata?.totalItems}
                dataSource={data?.results.filter(v => v.status == AppointmentStatus.Doing)}
                columns={columns1}
                onChangeTable={handleChangeTable}
                className='no-footer-table'
            // scrollX={1200}
            />

            <ModalAppointment
                isOpenModal={isOpenModal}
                handleCloseModal={handleCloseModal}
                appointment={data?.results.find(v => v.id == selected?.id)}
                patient={selected?.patient}
                refetch={refetch}
            ></ModalAppointment>
        </div>
    )
}

export default BacSi
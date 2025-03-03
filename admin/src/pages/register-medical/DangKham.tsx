import ApiAppointment, { IAppointment } from '@/api/ApiAppointment';
import { IUsedTypeService } from '@/api/ApiService';
import { InputSearchGlobal } from '@/components/AntdGlobal'
import ModalAlowAppointment from '@/components/ModalGlobal/ModalAlowAppointment';
import ModalCreateEditAppointment from '@/components/ModalGlobal/ModalCreateEditAppointment';
import TableGlobal, { IChangeTable, TABLE_DEFAULT_VALUE } from '@/components/TableGlobal';
import { getSocket } from '@/redux/slices/socketService';
import { useQuery } from '@tanstack/react-query';
import { Button, Checkbox, DatePicker, Row, Space, Tag, TimePicker } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { LuClipboardEdit } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

function RegisterMedical({ type, rf }: any) {
    const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [listParams, setListParams] = useState<Query & { start_date?: string, end_date?: string, type?: string }>({
        page: 1,
        limit: TABLE_DEFAULT_VALUE.defaultPageSize,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        type,
    });
    const [selected, setSelected] = useState<any>();

    const handleCloseModal = () => {
        setSelected(undefined);
        setIsOpenModal(false);
    };

    const { data, refetch } = useQuery(
        ["get_appointments", listParams],
        () => ApiAppointment.list(listParams),
        {
            keepPreviousData: true,
        }
    );

    const handleChangeTable = (value: IChangeTable) => {
        setListParams((prev) => ({
            ...prev,
            page: value.page,
            limit: value.pageSize,
        }));
    };

    const columns: ColumnsType<IAppointment> = [
        {
            title: "Mã",
            align: "center",
            width: 40,
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
            title: "Ngày khám",
            dataIndex: 'appointment_date',
            align: "center",
            width: 100,
            render: (value) => moment(value).format('HH:ss DD/MM/YYYY')
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
            title: "Bác sĩ khám",
            dataIndex: ['doctor', 'full_name'],
            align: "center",
            width: 100,
        },
        {
            title: "Trạng thái",
            dataIndex: 'status',
            align: "center",
            width: 100,
        },
        // {
        //     title: 'Hành động',
        //     fixed: 'right',
        //     width: 100,
        //     align: 'center',
        //     render: (_, record) => {
        //         return (
        //             <div>
        //                 <Button type='text' onClick={() => {
        //                     setSelected(record);
        //                     setIsOpenModal(true)
        //                 }}><FaEdit /></Button>
        //                 <Button type='text' onClick={() => {
        //                     setSelected(record);
        //                     setIsOpenModalCreate(true)
        //                 }}><LuClipboardEdit /></Button>
        //                 <Button type='text' ><MdDelete className='text-red-700 ' /></Button>
        //             </div>
        //         )
        //     }
        // }
    ];

    useEffect(() => {
        const socket = getSocket()
        if (socket) socket.on('reload1', (v) => {
            refetch()
            rf()
        })
    }, [])

    return (
        <div>
            <Row className="mb-5" justify="space-between">
                <Space>
                    <InputSearchGlobal
                        onChange={(e) => setSearchValue(e.target.value.trim())}
                        onSearch={() =>
                            setListParams(prev => ({ ...prev, search: searchValue }))
                        }
                        placeholder="Nhập tên bệnh nhân"
                    />

                    {/* <DatePicker.RangePicker
                        onChange={e =>
                            setListParams(prev => ({ ...prev, start_date: e?.[0]?.format('YYYY-MM-DD'), end_date: e?.[1]?.format('YYYY-MM-DD') }))}
                        value={[moment(listParams.start_date), moment(listParams.end_date)]}
                        allowClear={false}

                    >
                    </DatePicker.RangePicker> */}
                    {/* {<Tag
                        onClick={() => setListParams(prev => ({
                            ...prev, start_date: moment().format('YYYY-MM-DD'),
                            end_date: moment().format('YYYY-MM-DD')
                        }))}
                        color={listParams.start_date && listParams.start_date == listParams.end_date && isToday(new Date(listParams.start_date)) ? 'green' : 'red'}
                    >Hôm Nay</Tag>} */}

                    {<Tag
                        color={'green'}
                    >{moment().format('DD/MM/YYYY')}</Tag>}
                </Space>


                <Space>
                    <Button type='primary' onClick={() => setIsOpenModalCreate(true)}>Thêm lịch khám</Button>
                </Space>

            </Row>
            <TableGlobal
                total={data?.metadata?.totalItems}
                dataSource={data?.results}
                columns={columns}
                onChangeTable={handleChangeTable}

            // scrollX={1200}
            />
        </div>
    )
}

export default RegisterMedical
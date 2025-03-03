import ApiAppointment, { AppointmentStatus, IAppointment } from '@/api/ApiAppointment';
import { InputSearchGlobal } from '@/components/AntdGlobal'
import ModalUpdateAppFuture from '@/components/ModalGlobal/ModalUpdateAppFuture';
import ModalCreateEditLichHen from '@/components/ModalGlobal/ModalCreateEditLichHen';
import TableGlobal, { IChangeTable, TABLE_DEFAULT_VALUE } from '@/components/TableGlobal';
import PermissionWarpper from '@/layouts/PermissionWarpper';
import { ERole } from '@/lazyLoading';
import { EditOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Checkbox, DatePicker, Popconfirm, Row, Space, Tag, TimePicker } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useState } from 'react';
import Notification from '@/components/Notification';
import { MdDelete } from 'react-icons/md';
import { MdStraight } from "react-icons/md";

function AppointmentManagement() {
    const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [listParams, setListParams] = useState<Query & { start_date?: string, end_date?: string }>({
        page: 1,
        limit: TABLE_DEFAULT_VALUE.defaultPageSize,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD')
    });
    const [selected, setSelected] = useState<any>();

    const handleCloseModal = () => {
        setSelected(undefined);
        setIsOpenModal(false);
    };

    const { data, refetch } = useQuery(
        ["get_appointments_future", listParams],
        () => ApiAppointment.listFuture(listParams),
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
    const deleteMutation = useMutation(ApiAppointment.remove)
    const columns: ColumnsType<IAppointment> = [
        // {
        //     title: "STT",
        //     align: "center",
        //     width: 80,
        //     render: (_, __, i) => i + 1,
        // },
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
            title: "Ngày đăng ký",
            dataIndex: 'created_at',
            align: "center",
            width: 100,
            render: (value) => moment(value).format('DD/MM/YYYY')
        },
        {
            title: "Ngày Khám",
            dataIndex: 'appointment_date',
            align: "center",
            width: 100,
            render: (value) => moment(value).format('HH:mm DD/MM/YYYY')
        },
        {
            title: "Hành động",
            align: "center",
            width: 100,
            fixed: "right",
            render: (_, record) => (
                <>
                    <PermissionWarpper permissions={[ERole.NHAN_VIEN_TIEP_DON, ERole.SUPER_ADMIN]} classname='flex items-center justify-center'>
                        <Button
                            onClick={() => {
                                setSelected(record);
                                setIsOpenModal(true);
                            }}
                            type='text'
                        >
                            <MdStraight />
                        </Button>

                        <Button
                            onClick={() => {
                                setSelected(record);
                                setIsOpenModalCreate(true);
                            }}
                            type='text'
                        >
                            <EditOutlined />
                        </Button>

                        <Popconfirm title="Bạn muốn xóa trường này" onConfirm={() => {
                            deleteMutation.mutate(record.id as number, {
                                onSuccess() {
                                    Notification.notificationSuccess('Xóa thành công')
                                    refetch()
                                }
                            })
                        }}>
                            <Button
                                type='text'
                                disabled={![AppointmentStatus.Pending, AppointmentStatus.Waitting].includes(record.status)}

                            >
                                <MdDelete className={[AppointmentStatus.Pending, AppointmentStatus.Waitting].includes(record.status) ? 'text-red-700 ' : ''} />
                            </Button>
                        </Popconfirm>
                    </PermissionWarpper>
                </>
            ),
        },
    ];

    function isToday(date: Date): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt thời gian của ngày hiện tại về 00:00:00

        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0); // Đặt thời gian của ngày cần so sánh về 00:00:00

        return today.getTime() === compareDate.getTime();
    }

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

                    <DatePicker.RangePicker
                        onChange={e =>
                            setListParams(prev => ({ ...prev, start_date: e?.[0]?.format('YYYY-MM-DD'), end_date: e?.[1]?.format('YYYY-MM-DD') }))}
                        defaultValue={[moment(), moment()]}
                        allowClear={false}

                    >

                    </DatePicker.RangePicker>
                    {<Tag
                        onClick={() => setListParams(prev => ({
                            ...prev, start_date: moment().format('YYYY-MM-DD'),
                            end_date: moment().format('YYYY-MM-DD')
                        }))}
                        color={listParams.start_date && listParams.start_date == listParams.end_date && isToday(new Date(listParams.start_date)) ? 'green' : 'red'}
                    >Hôm Nay</Tag>}
                </Space>


                <Space>
                    <Button type='primary' onClick={() => {
                        setSelected(null)
                        setIsOpenModalCreate(true)
                    }}>Thêm lịch hẹn</Button>
                </Space>

            </Row>
            <TableGlobal
                total={data?.metadata?.totalItems}
                dataSource={data?.results}
                columns={columns}
                onChangeTable={handleChangeTable}

            // scrollX={1200}
            />
            <ModalUpdateAppFuture
                isOpenModal={isOpenModal}
                handleCloseModal={handleCloseModal}
                selectedAppointment={selected}
            />
            <ModalCreateEditLichHen
                isOpenModal={isOpenModalCreate}
                handleCloseModal={() => setIsOpenModalCreate(false)}
                selectedAppointment={selected}
            />
        </div>
    )
}

export default AppointmentManagement
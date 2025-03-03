import ApiAppointment, { IAppointment } from '@/api/ApiAppointment';
import ApiPatient, { IPatient } from '@/api/ApiPatient';
import { IUsedTypeService } from '@/api/ApiService';
import { InputSearchGlobal } from '@/components/AntdGlobal'
import ModalAlowAppointment from '@/components/ModalGlobal/ModalAlowAppointment';
import ModalCreateEditAppointment from '@/components/ModalGlobal/ModalCreateEditAppointment';
import TableGlobal, { IChangeTable, TABLE_DEFAULT_VALUE } from '@/components/TableGlobal';
import { useQuery } from '@tanstack/react-query';
import { Button, Checkbox, DatePicker, Row, Space, TimePicker } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MedicalManagement() {
    const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [listParams, setListParams] = useState<Query>({
        page: 1,
        limit: TABLE_DEFAULT_VALUE.defaultPageSize,
    });
    const [selected, setSelected] = useState<any>();

    const navigate = useNavigate()

    const handleCloseModal = () => {
        setSelected(undefined);
        setIsOpenModal(false);
    };

    const { data } = useQuery(
        ["get_patients", listParams],
        () => ApiPatient.list(listParams),
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

    const columns: ColumnsType<IPatient> = [
        {
            title: "Mã",
            align: "center",
            dataIndex: 'id',
            width: 80,
            render: (value) => 'BN' + value,
        },
        {
            title: "Tên bệnh nhân",
            dataIndex: "full_name",
            align: "center",
            width: 100,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            align: "center",
            width: 100,
        },
        {
            title: "Ngày sinh",
            dataIndex: "birthday",
            align: "center",
            width: 100,
            render: (value) => moment(value).format('DD/MM/YYYY')
        },
        {
            title: "Địa chỉ",
            align: "center",
            width: 100,
            render: (_, record) => `${record?.wards?.name} ${record?.district?.name} ${record?.province?.name}`
        },
        {
            title: 'Hành động',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (_, reccord) => {
                return <div>
                    <Button onClick={() => { navigate(`${reccord.id}`) }} type='text'>Xem chi tiết</Button>
                </div>
            }
        }
    ];

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
                </Space>


                {/* <Space>
                    <Button type='primary' onClick={() => setIsOpenModalCreate(true)}>Thêm lịch khám</Button>
                </Space> */}

            </Row>
            <TableGlobal
                total={data?.metadata?.totalItems}
                dataSource={data?.results}
                columns={columns}
                onChangeTable={handleChangeTable}

            // scrollX={1200}
            />
            <ModalAlowAppointment
                isOpenModal={isOpenModal}
                handleCloseModal={handleCloseModal}
                selectedAppointment={selected}
            />
            <ModalCreateEditAppointment
                isOpenModal={isOpenModalCreate}
                handleCloseModal={() => setIsOpenModalCreate(false)}
            />
        </div>
    )
}

export default MedicalManagement
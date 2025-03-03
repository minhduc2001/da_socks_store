import ApiPatient from '@/api/ApiPatient';
import { InputSearchGlobal } from '@/components/AntdGlobal'
import ModalCreateEditPatient from '@/components/ModalGlobal/ModalCreateEditPatient';
import ModalCreateEditUser from '@/components/ModalGlobal/ModalCreateEditUser';
import TableGlobal, { IChangeTable, TABLE_DEFAULT_VALUE } from '@/components/TableGlobal';
import PermissionWarpper from '@/layouts/PermissionWarpper';
import { checkPermission, ERole } from '@/lazyLoading';
import { EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Row, Space } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useState } from 'react'

export default function PatientManagement() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [listParams, setListParams] = useState<Query>({
        page: 1,
        limit: TABLE_DEFAULT_VALUE.defaultPageSize,
    });
    const [selected, setSelected] = useState<any>();

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

    const columns: ColumnsType<any> = [
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
            width: 200,
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
            width: 150,
            render: (value) => moment(value).format("DD-MM-YYYY"),
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            align: "center",
            width: 150,
        },
        {
            title: "Địa chỉ",
            dataIndex: "description",
            align: "center",
            width: 400,
            render: (_, record) => `${record?.wards?.name} ${record?.district?.name} ${record?.province?.name}`
        },
        checkPermission([ERole.SUPER_ADMIN, ERole.NHAN_VIEN_TIEP_DON]) && {
            title: "Hành động",
            align: "center",
            width: 100,
            fixed: "right",
            render: (_, record) => (
                <PermissionWarpper permissions={[ERole.SUPER_ADMIN, ERole.NHAN_VIEN_TIEP_DON]}>
                    <span
                        className="p-2 cursor-pointer"
                        role="presentation"
                        onClick={() => {
                            setSelected(record);
                            setIsOpenModal(true);
                        }}
                    >
                        <EditOutlined />
                    </span>
                </PermissionWarpper>
            ),
        },
    ].filter(Boolean);

    return (
        <div className="">
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
                    <ButtonGlobal
                        title="Thêm bệnh nhân"
                        onClick={() => setIsOpenModal(true)}
                    />
                </Space> */}
            </Row>
            <TableGlobal
                total={data?.metadata.totalItems}
                dataSource={data?.results}
                columns={columns}
                onChangeTable={handleChangeTable}
                scrollX={1200}
            />
            <ModalCreateEditPatient
                isOpenModal={isOpenModal}
                handleCloseModal={handleCloseModal}
                patient={selected}
            />
        </div >
    )
}
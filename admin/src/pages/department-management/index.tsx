import ApiDepartment from '@/api/ApiDepartment';
import { InputSearchGlobal } from '@/components/AntdGlobal'
import ButtonGlobal from '@/components/ButtonGlobal';
import ModalCreateEditDepartment from '@/components/ModalGlobal/ModalCreateEditDepartment';
import TableGlobal, { IChangeTable, TABLE_DEFAULT_VALUE } from '@/components/TableGlobal';
import PermissionWarpper from '@/layouts/PermissionWarpper';
import { ERole, checkPermission } from '@/lazyLoading';
import { EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Row, Space } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useState } from 'react'

function DepartmentManagement() {
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
        ["get_departments", listParams],
        () => ApiDepartment.list(listParams),
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
            title: "STT",
            align: "center",
            width: 80,
            render: (_, __, i) => i + 1,
        },
        {
            title: "Tên phòng ban",
            dataIndex: "name",
            align: "center",
            width: 250,
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            align: "center",
            width: 400,
        },
        {
            title: "Hành động",
            align: "center",
            width: 100,
            fixed: "right",
            render: (_, record) => (
                <>
                    <PermissionWarpper permissions={[ERole.SUPER_ADMIN]}>
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
                </>
            ),
        },
    ];

    return (
        <div className="">
            <Row className="mb-5" justify="space-between">
                <Space>
                    <InputSearchGlobal
                        onChange={(e) => setSearchValue(e.target.value.trim())}
                        onSearch={() =>
                            setListParams(prev => ({ ...prev, search: searchValue }))
                        }
                        placeholder="Nhập tên phòng ban"
                    />
                </Space>

                <Space>
                    <ButtonGlobal
                        title="Thêm phòng ban"
                        onClick={() => setIsOpenModal(true)}
                    />
                </Space>
            </Row>
            <TableGlobal
                total={data?.metadata.totalItems}
                dataSource={data?.results}
                columns={columns}
                onChangeTable={handleChangeTable}
                scrollX={1200}
            />
            <ModalCreateEditDepartment
                handleCloseModal={handleCloseModal}
                isOpenModal={isOpenModal}
                selectedDepartment={selected}
            />
        </div>
    )
}

export default DepartmentManagement
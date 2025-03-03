import ApiService, { ITypeService } from "@/api/ApiService";
import { InputSearchGlobal } from "@/components/AntdGlobal";
import ButtonGlobal from "@/components/ButtonGlobal";
import ModalCreateEditService from "@/components/ModalGlobal/ModalCreateEditCategory";
import ModalCreateEditTypeService from "@/components/ModalGlobal/ModalCreateEditTypeService";
import Notification from "@/components/Notification";
import TableGlobal, {
    IChangeTable,
    TABLE_DEFAULT_VALUE,
} from "@/components/TableGlobal";
import PermissionWarpper from "@/layouts/PermissionWarpper";
import {
    ERole,
    checkPermission,
} from "@/lazyLoading";
import store from "@/redux/store";
import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Row, Space, Switch } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useState } from "react";

export default function TypeServicePage() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [serviceParams, setServiceParams] = useState<Query>({
        page: 1,
        limit: TABLE_DEFAULT_VALUE.defaultPageSize,
    });
    const [selectedService, setSelectedService] = useState<ITypeService>();

    const { data: services } = useQuery(
        ["get_type_services", serviceParams],
        () => ApiService.getTypeServices(serviceParams),
        {
            keepPreviousData: true,
        }
    );

    const handleCloseModal = () => {
        setSelectedService(undefined);
        setIsOpenModal(false);
    };

    const handleChangeTable = (value: IChangeTable) => {
        setServiceParams({
            ...serviceParams,
            page: value.page,
            limit: value.pageSize,
        });
    };

    const avtiveMutation = useMutation(ApiService.activeTypeService);

    const columns: any = [
        {
            title: "Mã",
            align: "center",
            dataIndex: 'id',
            width: 80,
            render: (value) => 'DV' + value,
        },
        {
            title: "Tên dịch vụ khám",
            dataIndex: "name",
            align: "center",
            width: 300,
        },
        {
            title: "Giá dịch vụ",
            dataIndex: "price",
            align: "center",
            width: 150,
        },

        // {
        //     title: "BHYT hỗ trợ",
        //     dataIndex: "insurance",
        //     align: "center",
        //     width: 200,
        //     render(value) {
        //         return value ? 'Có' : 'Không'
        //     }
        // },
        {
            title: "Mô tả",
            dataIndex: "description",
            align: "center",
        },
        checkPermission([ERole.SUPER_ADMIN, ERole.QUAN_LY]) && {
            title: "Hành động",
            align: "center",
            width: 200,
            fixed: "right",
            render: (_, record) => (
                <>

                    <PermissionWarpper permissions={[ERole.SUPER_ADMIN, ERole.QUAN_LY]}>
                        <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            defaultChecked={record.active}
                            loading={avtiveMutation.isLoading}
                            onChange={(e) => {
                                avtiveMutation.mutate(
                                    { id: record.id, active: e },
                                    {
                                        onSuccess: (resp) => {
                                            Notification.notificationSuccess(resp);
                                        },
                                    }
                                );
                            }}
                        ></Switch>
                        <span
                            className="m-3 p-2 cursor-pointer"
                            role="presentation"
                            onClick={() => {
                                setSelectedService(record);
                                setIsOpenModal(true);
                            }}
                        >
                            <EditOutlined />
                        </span>
                    </PermissionWarpper>

                </>
            ),
        },
    ].filter(Boolean);

    return (
        <div>
            <Row className="mb-5" justify="space-between">
                <Space>
                    <InputSearchGlobal
                        onChange={(e) => setSearchValue(e.target.value.trim())}
                        onSearch={() =>
                            setServiceParams({ ...serviceParams, search: searchValue })
                        }
                        placeholder="Nhập tên dịch vụ"
                    />
                </Space>

                <Space>
                    <PermissionWarpper permissions={[ERole.SUPER_ADMIN, ERole.QUAN_LY]}>
                        <ButtonGlobal
                            title="Thêm loại dịch vụ"
                            onClick={() => setIsOpenModal(true)}
                        />
                    </PermissionWarpper>

                </Space>

            </Row>
            <TableGlobal
                total={services?.metadata.totalItems}
                dataSource={services?.results}
                columns={columns}
                onChangeTable={handleChangeTable}
            />
            <ModalCreateEditTypeService
                isOpenModal={isOpenModal}
                handleCloseModal={handleCloseModal}
                selectedService={selectedService}
            />
        </div>
    );
}

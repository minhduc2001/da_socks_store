import ApiPatient from '@/api/ApiPatient'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb, Col, Row, Card, Timeline, Typography, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import './index.scss'
import { IAppointment } from '@/api/ApiAppointment'
import ModalAppointment from '@/components/ModalGlobal/ModalAppointment'

const { Title, Text } = Typography

function Detail() {
    const { id } = useParams()
    const [appointment, setAppointment] = useState<IAppointment | undefined>();
    const { data: dataPatient, refetch, isLoading } = useQuery(['get_patient', { id }], () => ApiPatient.getFullInfo(id), { enabled: false })
    const [isOpenModal, setIsOpenModal] = useState(false);
    const handleCloseModal = () => {
        setAppointment(undefined);
        setIsOpenModal(false);
    };

    useEffect(() => { if (id) refetch() }, [id])

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mb-5">
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={'/ho-so-benh-an'}>Hồ sơ bệnh nhân</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{dataPatient?.full_name}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Row gutter={24}>
                {/* Patient Information */}
                <Col span={8}>
                    <Card className="shadow-md">
                        <div className="text-xl font-semibold mb-4 text-blue-600">Thông tin bệnh nhân</div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Text strong>Họ tên:</Text>
                                <Text>{dataPatient?.full_name}</Text>
                            </div>
                            <Divider />
                            <div className="flex justify-between">
                                <Text strong>Ngày sinh:</Text>
                                <Text>{moment(dataPatient?.birthday).format('DD-MM-YYYY')}</Text>
                            </div>
                            <Divider />
                            <div className="flex justify-between">
                                <Text strong>Giới tính:</Text>
                                <Text>{dataPatient?.gender}</Text>
                            </div>
                            <Divider />
                            <div className="flex justify-between">
                                <Text strong>Địa chỉ:</Text>
                                <Text>{`${dataPatient?.wards.name}, ${dataPatient?.district.name}, ${dataPatient?.province.name}`}</Text>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Medical History */}
                <Col span={16}>
                    <div className="shadow-lg bg-white p-6 rounded-md">
                        <h3 className="text-xl font-semibold text-blue-600 mb-4">Lịch sử khám chữa bệnh</h3>
                        <div className="space-y-6">
                            {dataPatient?.appointments.sort((a: any, b: any) => b.id - a.id).map((app) => (
                                <div key={app.id} className="flex flex-col space-y-2"
                                    onClick={() => {
                                        setAppointment(app);
                                        setIsOpenModal(true)
                                    }}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500 font-medium">
                                            {moment(app.appointment_date).format('DD/MM/YYYY')}
                                        </span>
                                        <div className="text-right space-y-1">
                                            {app?.used_type_services?.map((sv) => (
                                                <span key={sv.id} className="block text-sm text-gray-700">
                                                    {sv?.type_service?.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>
            <ModalAppointment
                appointment={dataPatient?.appointments.find(a => a.id == appointment?.id)}
                isOpenModal={isOpenModal}
                handleCloseModal={handleCloseModal}
                patient={dataPatient}
                refetch={refetch}
                disable={dataPatient?.appointments.sort((a: any, b: any) => b.id - a.id)?.[0].id != appointment?.id}
            />
        </div>
    )
}

export default Detail;

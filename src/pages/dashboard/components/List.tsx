import React, {memo, useEffect, useState} from 'react'
import { Empty, Button, List as ListAD, Col, Row, Popover, Input, message } from 'antd'
import { Link } from "react-router-dom";
import { EditOutlined } from '@ant-design/icons';
import { project } from '@/api';
import { useLoadList } from "./hooks";
import { Project } from '@/api/list/project';
import style from "./list.module.less";

function List() {
    const [list, setList] = useState<Project[]>([])
    const [visible, setVisible] = useState<boolean | number | string | null>(false)
    const [desc, setDesc] = useState('')
    const { loading, loadFn } = useLoadList();
    const editDesc = (item: Project) => {
        setDesc(item.desc)
        setVisible(item.id)
    }

    const saveDesc = async (item: Project) => {
        if (!desc) return message.error('请填写描述信息！')
        await project.updateOtherConfig({
            data: {
                desc: desc,
            },
            id: item.id,
        });
        setList(await loadFn())
        setVisible(null)
        message.success('更新成功！');
    }

    const renderDescription = (item: Project) => {
        return <div className={style.desc}>
            <div>
                描述：
                <span>{item.desc}</span>
                <Popover
                    content={<Input.Group size="large">
                        <Row gutter={8} justify={'end'}>
                            <Col span={10}>
                                <Input.TextArea autoSize={{ minRows: 2 }} style={{ "height": '32px' }} value={desc} />
                            </Col>
                            <Col span={5}>
                                <Button type="primary" style={{ marginTop: 10 }}
                                    onClick={() => saveDesc(item)}>确定</Button>
                            </Col>
                        </Row>
                    </Input.Group>}
                    onVisibleChange={v => {
                        !v && setVisible(false)
                    }}
                    visible={visible === item.id} trigger="click">
                    <EditOutlined onClick={() => editDesc(item)}
                        style={{ "cursor": 'pointer' }} />
                </Popover>
            </div>
            <div>
                更新时间：<span>{item.updatedAt}</span>
            </div>
            <div>
                创建时间：<span>{item.createdAt}</span>
            </div>
        </div>
    }

    const loadData = async () => {
        setList(await loadFn())
    }

    const emptyElement = <Empty description={<span> 暂无页面，快去创建吧 </span>}>
        <Button type="primary">
            <Link to="/template">创建页面</Link>
        </Button>
    </Empty>

    useEffect(() => {
        loadData().finally(() => { });
    }, [])

    return <div className={style['user-page-list']}>
        <div className={style.list}>
            <div className={style.top}>
                {list.length > 0 && <Button>
                    <Link to="/template">创建页面</Link>
                </Button>}
            </div>

            <ListAD
                className={style["demo-loadmore-list"]}
                loading={loading}
                itemLayout={'horizontal'}
                renderItem={item => {
                    return <ListAD.Item
                        actions={[<Link to={`/edit?id=${item.id}&pageId=${item.gitConfig.id}`}>编辑</Link>]}>
                        <ListAD.Item.Meta
                            title={item.pageConfig.config.projectName}
                            description={renderDescription(item)}>
                        </ListAD.Item.Meta>
                    </ListAD.Item>
                }}
                locale={{ emptyText: emptyElement }}
                dataSource={list}>
            </ListAD>
        </div>
    </div>
}

export default memo(List)
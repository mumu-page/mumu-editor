import React, {useEffect, useState} from 'react'
import {Empty, Button, List as ListAD, Col, Row, Popover, Input, message, Spin} from 'antd'
import {Link} from "react-router-dom";
import {EditOutlined} from '@ant-design/icons';
import {project} from '@/api';
import {useLoadList} from "./hooks";
import 'antd/lib/list/style/index.css'
import 'antd/lib/button/style/index.css'
import 'antd/lib/empty/style/index.css'
import 'antd/lib/popover/style/index.css'
import 'antd/lib/input/style/index.css'
import style from "./list.module.less";

interface ItemState {
    pageConfig: Record<string, any>;
    desc: string;
    id: string | number;
    updatedAt: string
    createdAt: string
    gitConfig: Record<string, any>;
}

function List() {
    const [list, setList] = useState<ItemState[]>([])
    const [visible, setVisible] = useState<boolean | number | string | null>(false)
    const [desc, setDesc] = useState('')
    const {loading, loadFn} = useLoadList();
    const editDesc = (item: ItemState) => {
        setDesc(item.desc)
        setVisible(item.id)
    }

    const saveDesc = async (item: ItemState) => {
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

    const renderDescription = (item: ItemState) => {
        return <div className={style.desc}>
            <div>
                描述：
                <span>{item.desc}</span>
                <Popover
                    content={<Input.Group size="large">
                        <Row gutter={8} justify={'end'}>
                            <Col span={10}>
                                <Input.TextArea autoSize={{minRows: 2}} style={{"height": '32px'}} value={desc}/>
                            </Col>
                            <Col span={5}>
                                <Button type="primary" style={{marginTop: 10}}
                                        onClick={() => saveDesc(item)}>确定</Button>
                            </Col>
                        </Row>
                    </Input.Group>}
                    onVisibleChange={v => {
                        !v && setVisible(false)
                    }}
                    visible={visible === item.id} trigger="click">
                    <EditOutlined onClick={() => editDesc(item)}
                                  style={{"cursor": 'pointer'}}/>
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

    useEffect(() => {
        loadData().finally(() => {});
    }, [])

    return <div className={style['user-page-list']}>
        {loading && <Spin />}
        {!list.length && !loading ? <div className={style["empty-list"]}>
            <Empty description={<span> 暂无页面，快去创建吧 </span>}>
                <Button type="primary">
                    <Link to="/template">创建页面</Link>
                </Button>
            </Empty>
        </div> : <div className={style.list}>
            <Button className={style.top}>
                <Link to="/template">创建页面</Link>
            </Button>
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
                dataSource={list}>
            </ListAD>
        </div>}
    </div>
}

export default List
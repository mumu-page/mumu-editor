import React, {useEffect, useState} from 'react'
import Header from '../../components/Header'
import {Spin, Card, Modal, Form, Input, Select} from "antd";
import {market} from "@/api";
import 'antd/lib/card/style/index.css'
import 'antd/lib/modal/style/index.css'
import 'antd/lib/form/style/index.css'
import style from './index.module.less'

const ModalAntd: any = Modal

interface TemplateState {
    id: string;
    templateName: string;
    author: string;
    version: string;
}

export default function Template() {
    const [creating, setCreating] = useState(false)
    const [gitName, setGitName] = useState('')
    const [projectName, setProjectName] = useState('')
    const [host, setHost] = useState('')
    const [pageInfo, setPageInfo] = useState({})
    const [createDialog, setCreateDialog] = useState(false)
    const [templateList, setTemplateList] = useState<TemplateState[]>([])
    const labelCol = {span: 4}
    const wrapperCol = {span: 20}
    // const onSearch = () => {};
    const initPage = (config: any) => {
        setPageInfo(config);
        setCreateDialog(true)
    }
    const createPage = () => {
        // validate().then(async () => {
        //     state.creating = true;
        //     try {
        //         const data = await project.createProject({
        //             pageConfig: {
        //                 config: {
        //                     templateId: state.pageInfo.id,
        //                     templateGit: state.pageInfo.gitUrl,
        //                     templateName: state.pageInfo.name,
        //                     projectName: pageState.projectName || '未命名的页面',
        //                     gitName: pageState.gitName,
        //                     templateVersion: state.pageInfo.version,
        //                 },
        //                 userSelectComponents: [],
        //                 components: [],
        //             }
        //         });
        //         state.creating = false;
        //         router.push({
        //             path: '/edit',
        //             query: {
        //                 id: data.result.id,
        //             }
        //         })
        //     } catch (e) {
        //         state.creating = false;
        //     }
        // });
    }

    useEffect(() => {
        market.queryAll().then(({result}) => {
            setTemplateList(result);
        });
    }, [])

    return (
        <>
            {creating && <Spin/>}
            {!creating && <>
              <Header/>
              <div className={style["index-wrapper"]}>
                  {templateList.map(item => {
                      return <Card
                          key={item.id}
                          hoverable
                          style={{"width": "240px"}}
                          onClick={() => initPage(item)}
                          cover={<img alt="example"
                                      src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
                      >
                          <Card.Meta
                              title={item.templateName}
                              description={<>
                                  <div>作者：{item.author}</div>
                                  <div>版本：{item.version}</div>
                              </>}/>
                      </Card>
                  })}
              </div>
            </>}
            <ModalAntd
                visible={createDialog}
                title="请填写页面信息"
                okText="确定"
                cancelText="取消"
                width="560"
                onOk={createPage}
            >
                <Form label-col={labelCol} wrapperCol={wrapperCol}>
                    <Form.Item label="项目名称" valuePropName="validateInfos.projectName">
                        <Input placeholder="如：营销活动" value={projectName}/>
                    </Form.Item>
                    <Form.Item label="活动域名" valuePropName="validateInfos.gitName">
                        <Input.Group compact>
                            <Select value={host}>
                                <Select.Option value="https://mumu-page.github.io/">
                                    https://mumu-page.github.io/
                                </Select.Option>
                            </Select>
                            <Input
                                placeholder="路径"
                                style={{"width": "95px"}}
                                value={gitName}
                            />
                            <div className={style.fix}>/index.html</div>
                        </Input.Group>
                    </Form.Item>
                </Form>
            </ModalAntd>
        </>
    )
}

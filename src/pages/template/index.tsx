import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Spin, Card, Modal, Form, Input, Select, InputNumber } from "antd";
import { market, project } from "@/api";
import { TemplateData } from "@/api/list/market";
import { useNavigate } from 'react-router-dom';
import 'antd/lib/card/style/index.css'
import 'antd/lib/modal/style/index.css'
import 'antd/lib/form/style/index.css'
import 'antd/lib/select/style/index.css'
import 'antd/lib/input/style/index.css'
import 'antd/lib/input-number/style/index.css'
import style from './index.module.less'
const ModalAntd = Modal as any

interface FormDataState {
  projectName: string;
  gitName: Record<string, string>
}

const initialValues: FormDataState = {
  projectName: '',
  gitName: {
    host: 'https://mumu-page.github.io/',
    route: 'demo',
    html: '/index.html'
  },
}

export default function Template(props: any) {
  const [form] = Form.useForm<FormDataState>()
  const [creating, setCreating] = useState(false)
  const [pageInfo, setPageInfo] = useState<TemplateData>()
  const [createDialog, setCreateDialog] = useState(false)
  const [templateList, setTemplateList] = useState<TemplateData[]>([])
  const navigate = useNavigate()
  const labelCol = { span: 4 }
  const wrapperCol = { span: 20 }
  // const onSearch = () => {};
  const initPage = (config: TemplateData) => {
    setPageInfo(config);
    setCreateDialog(true)
  }
  const createPage = async () => {
    const values = await form.validateFields()
    setCreating(true)
    if (!pageInfo) return
    try {
      const data = await project.createProject({
        pageConfig: {
          config: {
            templateId: pageInfo!.id,
            templateGit: pageInfo.gitUrl,
            templateName: pageInfo.name,
            projectName: values.projectName || '未命名的页面',
            gitName: `${values.gitName.route}`,
            version: pageInfo.version,
          },
          userSelectComponents: [],
          components: [],
        }
      });
      setCreating(false)
      setCreateDialog(false)
      navigate('/edit', { state: { id: data.result.id } })
    } catch (e) {
      setCreating(false)
    }
  }

  const onClose = () => {
    setCreateDialog(false)
  }

  useEffect(() => {
    market.queryAll().then((data) => {
      setTemplateList(data);
    });
  }, [])

  return (
    <>
      <Spin spinning={creating}>
        <Header />
        <div className={style["index-wrapper"]}>
          {templateList.map(item => {
            return <Card
              key={item.id}
              hoverable
              style={{ "width": "240px" }}
              onClick={() => initPage(item)}
              cover={<img alt="example"
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
            >
              <Card.Meta
                title={item.templateName}
                description={<>
                  <div>作者：{item.author}</div>
                  <div>版本：{item.version}</div>
                </>} />
            </Card>
          })}
        </div>
      </Spin>
      <ModalAntd
        visible={createDialog}
        title="请填写页面信息"
        okText="确定"
        cancelText="取消"
        maskClosable={false}
        width={660}
        onOk={createPage}
        onCancel={onClose}
        confirmLoading={creating}
      >
        <Form
          form={form}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          initialValues={initialValues} >
          <Form.Item label="项目名称" name="projectName">
            <Input placeholder="如：营销活动" />
          </Form.Item>
          <Form.Item label="活动域名" name="gitName">
            <Input.Group compact>
              <Form.Item
                label="活动域名"
                name={['gitName', 'host']}
                noStyle>
                <Select style={{ width: 240 }}>
                  <Select.Option value="https://mumu-page.github.io/">
                    https://mumu-page.github.io/
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="活动域名"
                name={['gitName', 'route']}
                noStyle>
                <Input
                  placeholder="路径"
                  style={{ "width": 95 }}
                />
              </Form.Item>
              <Form.Item
                label="活动域名"
                name={['gitName', 'html']}
                noStyle>
                <InputNumber readOnly disabled style={{ "width": 100 }} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Form>
      </ModalAntd>
    </>
  )
}

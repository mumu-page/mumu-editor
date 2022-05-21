import { PictureOutlined } from '@ant-design/icons';
import { Input, Popover } from 'antd';
import React from 'react';

const DEFAULT_IMG =
  'https://img.alicdn.com/tfs/TB14tSiKhTpK1RjSZFKXXa2wXXa-354-330.png';

const PreviewNode = ({ value }: any) => {
  return (
    <Popover
      getPopupContainer={triggerNode => document.body}
      content={
        <img
          src={value || DEFAULT_IMG}
          alt="图片地址错误"
          width={200}
          className="fr-preview-image"
        />
      }
      className="fr-preview"
      placement="topRight"
    >
      <PictureOutlined />
    </Popover>
  );
};

export default function imageInput({ value, ...rest }: any) {
  return (
    <Input value={value} addonAfter={<PreviewNode value={value} />} {...rest} />
  );
}
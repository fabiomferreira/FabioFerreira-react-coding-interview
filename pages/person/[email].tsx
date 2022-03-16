import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Button, PageHeader, Descriptions, Input, message, Form, Select } from 'antd';

import { withContextInitialized } from '../../components/hoc';
import CompanyCard from '../../components/molecules/CompanyCard';
import GenericList from '../../components/organisms/GenericList';
import OverlaySpinner from '../../components/molecules/OverlaySpinner';
import { usePersonInformation } from '../../components/hooks/usePersonInformation';

import { Company } from '../../constants/types';
import { ResponsiveListCard } from '../../constants';

const PersonDetail = () => {
  const router = useRouter();
  const { load, loading, save, data } = usePersonInformation(
    router.query?.email as string,
    true
  );
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    load();
  }, []);

  const savePersonData = () => {
    setIsEditing(false);
  }

  if (loading) {
    return <OverlaySpinner title={`Loading ${router.query?.email} information`} />;
  }

  if (!data) {
    message.error("The user doesn't exist redirecting back...", 2, () =>
      router.push('/home')
    );
    return <></>;
  }

  return (
    <>
      <PageHeader
        onBack={router.back}
        title="Person"
        subTitle="Profile"
        extra={[
          <Button
            style={{ padding: 0, margin: 0 }}
            type="link"
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit website
          </Button>,
          <Button type="default" onClick={() => setIsEditing(true)}>
            Edit
          </Button>,
        ]}
      >
        {data && (
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="Name">{data.name}</Descriptions.Item>
            <Descriptions.Item label="Gender">{data.gender}</Descriptions.Item>
            <Descriptions.Item label="Phone">{data.phone}</Descriptions.Item>

            <Descriptions.Item label="Birthday">{data.birthday}</Descriptions.Item>
          </Descriptions>
        )}
        {
          isEditing && (
            <Form initialValues={data} onFinish={savePersonData}>
              <Form.Item label="Name" name="name">
                <Input />
              </Form.Item>

              <Form.Item label="Gender" name="gender">
                <Select />
              </Form.Item>

              <Form.Item label="Phone" name="phone">
                <Input type="tel" />
              </Form.Item>

              <Form.Item label="Birthday" name="birthday">
                <Input type="date" />
              </Form.Item>

              <Button type="default" htmlType='submit'>
                Save  
              </Button>

            </Form>
          )
        }
        <GenericList<Company>
          loading={loading}
          extra={ResponsiveListCard}
          data={data && data.companyHistory}
          ItemRenderer={({ item }: any) => <CompanyCard item={item} />}
          handleLoadMore={() => { }}
          hasMore={false}
        />
      </PageHeader>
    </>
  );
};

export default withContextInitialized(PersonDetail);

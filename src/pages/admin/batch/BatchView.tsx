import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// helpers
import { apiHandler } from '../../../handlers/apiHandler';
import { showMessage } from '../../../handlers/messageHandler';

// layouts
import ViewLayout from '../../../layouts/crud_layouts/ViewLayout';

// components
import Card from '../../../components/global/Card';

// icons
import { MdDescription } from 'react-icons/md';
import { AiFillIdcard } from 'react-icons/ai';

// schemas
import { batchSchema } from '../../../utils/schemas';

const FacultyView = () => {
  const params = useParams();

  const [batch, setBatch] = useState<batchSchema>();
  const [isLoading, setIsLoading] = useState(true);

  const getBatch = async () => {
    await apiHandler('get', `batches/${params.batchId}`, null).then((res) => {
      if (res.success) {
        setBatch(res.data);
        setIsLoading(false);
      } else {
        showMessage(res.message, 'failure');
      }
    });
  };

  useEffect(() => {
    getBatch();
  }, []);

  return (
    <ViewLayout
      layoutTitle='View Batch'
      layoutSubtitle='Batch details'
      isLoading={isLoading}
    >
      <Card
        title='Name'
        subtitle={`${batch?.faculty} ${batch?.year}`}
        Icon={AiFillIdcard}
      />
      <Card
        title='CurrentSemester'
        subtitle={
          batch && Number(batch?.currentSemester) < 10
            ? `0${batch?.currentSemester}`
            : batch?.currentSemester
        }
        Icon={AiFillIdcard}
      />
      <div className='lg:col-span-2'>
        <Card title='Description' subtitle={batch?.desc} Icon={MdDescription} />
      </div>
    </ViewLayout>
  );
};

export default FacultyView;

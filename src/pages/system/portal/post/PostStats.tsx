import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// layouts
import ListLayout from '../../../../layouts/crud_layouts/ListLayout';

// utils
import { postStatsHeader } from '../../../../utils/tableHeaders';
import { postStats } from '../../../../utils/schemas';

// handlers
import { apiHandler } from '../../../../handlers/apiHandler';
import IconButton from '../../../../components/global/button/IconButton';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import Badge from '../../../../components/global/Badge';

const PostStats = () => {
  const params = useParams();

  const [students, setStudents] = useState<postStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [statsIndex, setStatsIndex] = useState<number>(0);

  const handleOpenStats = (index: number) => {
    setStatsIndex(index);
    setIsStatsOpen(!isStatsOpen);
  };

  const getPostStats = async () => {
    const res = await apiHandler(
      'get',
      `posts/${params.batchId}/${params.subjectId}/stats`,
      null
    );

    if (res.success) {
      setStudents(res.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostStats();
  }, []);

  return (
    <div className='pt-4'>
      <ListLayout
        tableHeader={postStatsHeader}
        layoutTitle='Students'
        layoutSubtitle={`${students.length} students joined`}
        isEmpty={students.length === 0}
        isLoading={isLoading}
        hasCreateBtn={false}
        hasBackBtn={true}
        hasAction={true}
      >
        {students.map((student: postStats, studentIndex) => {
          return (
            <Fragment key={studentIndex}>
              <tr className='bg-white dark:bg-gray-800'>
                <td className='px-6 py-4'>
                  {studentIndex + 1 < 10
                    ? `0${studentIndex + 1}`
                    : studentIndex + 1}
                </td>
                <td className='px-6 py-4 capitalize'>{student?.user?.name}</td>
                <td className='px-6 py-4'>{student?.user?.email}</td>
                <td className='px-6 py-4'>
                  <div className='flex gap-4 font-semibold'>
                    <p className='text-emerald-500'>{student?.stats?.done}</p>
                    <p className='text-yellow-500'>{student?.stats?.late}</p>
                    <p className='text-red-500'>{student?.stats?.missing}</p>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <IconButton
                    Icon={
                      isStatsOpen && studentIndex === statsIndex
                        ? BiChevronUp
                        : BiChevronDown
                    }
                    handleClick={() => handleOpenStats(studentIndex)}
                  />
                </td>
              </tr>
              {isStatsOpen && studentIndex === statsIndex && (
                <>
                  <tr className='font-bold text-xs uppercase border-t border-gray-300 dark:border-gray-600'>
                    <td className='px-6 py-4'></td>
                    <td className='px-6 py-4'></td>
                    <td className='px-6 py-4'>Title</td>
                    <td className='px-6 py-4'>Points</td>
                    <td className='px-6 py-4'>Status</td>
                  </tr>
                  {student?.posts?.map((post, postIndex) => {
                    return (
                      <tr
                        key={postIndex}
                        className={`text-sm ${
                          student?.posts?.length === postIndex + 1 &&
                          'border-b border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <td className='px-6 py-4'></td>
                        <td className='px-6 py-4'>
                          {postIndex + 1 < 10
                            ? `#0${postIndex + 1}`
                            : `#${postIndex + 1}`}
                        </td>
                        <td className='px-6 py-4'>{post?.title}</td>
                        <td className='px-6 py-4'>{post?.credit}</td>
                        <td className='px-6 py-4'>
                          <Badge
                            title={post?.status}
                            colorScheme={post?.status}
                            isSmall
                          />
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </Fragment>
          );
        })}
      </ListLayout>
    </div>
  );
};

export default PostStats;

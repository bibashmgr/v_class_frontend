import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// layouts
import FormLayout from '../../../../layouts/crud_layouts/FormLayout';

// components
import InputField from '../../../../components/global/form/InputField';
import SelectField from '../../../../components/global/form/SelectField';

// context
import { useUserInfo } from '../../../../context/UserInfoContext';

// icons
import { BsFileEarmarkFill, BsFillCloudArrowUpFill } from 'react-icons/bs';

// handlers
import { apiHandler } from '../../../../handlers/apiHandler';
import { showMessage } from '../../../../handlers/messageHandler';

// schemas
import { fileSchema, postFileSchema } from '../../../../utils/schemas';

const PostEdit = () => {
  const params = useParams();
  const userInfoContext = useUserInfo();

  const [post, setPost] = useState({
    desc: '',
    title: '',
    category: '',
    files: [],
  });
  const [files, setFiles] = useState<postFileSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({
    files: '',
  });

  const handleInputField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (Object.values(e.target.files).length > 5) {
        setErrors((prev) => ({
          ...prev,
          files: 'Maximum File Selection is 5.',
        }));
      } else {
        const formData = new FormData();

        Object.values(e.target.files).map((file) => {
          formData.append('files', file as Blob, file?.name);
        });

        const res = await apiHandler('post', 'files/create', formData, true);

        if (res.success) {
          let uploadedFileNames: string[] = [];
          let uploadedFiles: postFileSchema[] = [];

          res.data.map((file: fileSchema) => {
            uploadedFileNames.push(file.id);
            uploadedFiles.push({
              _id: file.id,
              filename: file.filename,
            });
          });

          setPost((prev) => ({ ...prev, files: uploadedFileNames as never[] }));
          setFiles(uploadedFiles);
        } else {
          showMessage(res.message, 'failure');
        }
      }
    }
  };

  const handleRemoveFile = async (fileIndex: number) => {
    const res = await apiHandler(
      'delete',
      `files/${files[fileIndex].filename}/delete`
    );

    if (res.success) {
      setPost((prev) => ({
        ...prev,
        files: prev.files.filter((file, index) => index !== fileIndex),
      }));
      setFiles([...files.filter((file, index) => index !== fileIndex)]);
    } else {
      showMessage(res.message, 'failure');
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await apiHandler('patch', `posts/${params.postId}`, post);

    if (res.success) {
      showMessage(res.message, 'success');
      setPost({
        desc: res.data.desc,
        title: res.data.title,
        category: res.data.category,
        files: res.data.files.map((file: postFileSchema) => {
          return file._id;
        }),
      });
      setFiles(res.data.files);
    } else {
      showMessage(res.message, 'failure');
    }
  };

  const getCategoryOptions = () => {
    if (userInfoContext?.userInfo?.role === 'student') {
      return [
        {
          title: 'Material',
          value: 'material',
        },
      ];
    } else {
      return [
        {
          title: 'Material',
          value: 'material',
        },
        {
          title: 'Assignment',
          value: 'assignment',
        },
      ];
    }
  };

  const getPost = async () => {
    const res = await apiHandler('get', `posts/${params.postId}`);

    if (res.success) {
      setPost({
        desc: res.data.desc,
        title: res.data.title,
        category: res.data.category,
        files: res.data.files.map((file: postFileSchema) => {
          return file._id;
        }),
      });
      setFiles(res.data.files);
      setIsLoading(false);
    } else {
      showMessage(res.message, 'failure');
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className='pt-4'>
      <FormLayout
        layoutTitle='Edit Post'
        layoutSubtitle='Fill out the forms'
        handleSubmit={handleUpdatePost}
        isEdit={true}
        isLoading={isLoading}
      >
        <InputField
          hasLabel
          type='text'
          label='Title'
          name='title'
          value={post?.title}
          handleChange={handleInputField}
          isRequired={true}
        />
        <SelectField
          hasLabel
          label='Category'
          name='category'
          value={post?.category}
          handleSelect={handleInputField}
          options={getCategoryOptions()}
          isRequired={true}
        />
        <InputField
          hasLabel
          label='Description'
          type='textarea'
          name='desc'
          value={post?.desc}
          handleChange={handleInputField}
          extraStyling='lg:col-span-2'
          isRequired={true}
        />
        <div className='flex flex-col gap-2 lg:col-span-2'>
          <label
            htmlFor='files'
            className='text-gray-400 dark:text-gray-400 text-sm font-semibold'
          >
            Files:
          </label>
          {errors.files && (
            <p className='text-xs text-failureColor-dark font-normal'>
              {errors.files}
            </p>
          )}
          <div
            className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700 ${
              files.length === 0 &&
              'hover:bg-gray-100  dark:hover:bg-gray-600 dark:hover:border-gray-500'
            } py-6 px-6`}
          >
            {files?.length === 0 ? (
              <div className='flex flex-col items-center justify-center'>
                <BsFillCloudArrowUpFill className='w-10 h-10 mb-3 text-gray-400' />
                <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  (PNG, JPG or PDF)
                </p>
              </div>
            ) : (
              <div className='flex gap-4 flex-wrap'>
                {files.map((file, index) => {
                  return (
                    <div
                      key={index}
                      className={`flex flex-col gap-1 justify-center items-center relative px-2 py-2  text-gray-400 dark:text-gray-300 hover:text-gray-200 dark:hover:text-white rounded-lg cursor-pointer hover:bg-failureColor-light`}
                      onClick={() => handleRemoveFile(index)}
                    >
                      <BsFileEarmarkFill className='w-14 h-14' />
                      <p className='text-xs font-normal'>
                        {file.filename.split('_')[1]}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <input
              id='files'
              type='file'
              className={`${
                files.length === 0
                  ? 'absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer'
                  : 'hidden'
              }`}
              multiple
              required={files.length === 0}
              accept='image/png, image/jpg, image/jpeg, .pdf'
              onChange={handleFiles}
            />
          </div>
        </div>
      </FormLayout>
    </div>
  );
};

export default PostEdit;
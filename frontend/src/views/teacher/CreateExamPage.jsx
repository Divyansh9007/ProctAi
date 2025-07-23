import React from 'react';
import { Grid, Box, Card, Typography, useTheme } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import ExamForm from './components/ExamForm';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useCreateExamMutation } from '../../slices/examApiSlice.js';
import { keyframes } from '@emotion/react';

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const gradientBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const examValidationSchema = yup.object({
  examName: yup.string().required('Exam Name is required'),
  totalQuestions: yup
    .number()
    .typeError('Total Number of Questions must be a number')
    .integer('Total Number of Questions must be an integer')
    .positive('Total Number of Questions must be positive')
    .required('Total Number of Questions is required'),
  duration: yup
    .number()
    .typeError('Exam Duration must be a number')
    .integer('Exam Duration must be an integer')
    .min(1, 'Exam Duration must be at least 1 minute')
    .required('Exam Duration is required'),
  liveDate: yup.date().required('Live Date and Time is required'),
  deadDate: yup.date().required('Dead Date and Time is required'),
});

const CreateExamPage = () => {
  const theme = useTheme();
  const { userInfo } = useSelector((state) => state.auth);

  const initialExamValues = {
    examName: '',
    totalQuestions: '',
    duration: '',
    liveDate: '',
    deadDate: '',
  };

  const formik = useFormik({
    initialValues: initialExamValues,
    validationSchema: examValidationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const dispatch = useDispatch();
  const [createExam, { isLoading }] = useCreateExamMutation();

  const handleSubmit = async (values) => {
    try {
      const res = await createExam(values).unwrap();
      toast.success('Exam Created successfully');
      formik.resetForm();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <PageContainer title="Create Exam" description="Create a new exam">
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          '&:before': {
            content: '""',
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 50%, ${theme.palette.info.light} 100%)`,
            backgroundSize: '400% 400%',
            animation: `${gradientBackground} 15s ease infinite`,
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            opacity: '0.3',
            zIndex: 0,
          },
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
            opacity: 0.2,
            animation: `${floatAnimation} 6s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.secondary.main} 0%, transparent 70%)`,
            opacity: 0.2,
            animation: `${floatAnimation} 8s ease-in-out infinite`,
            animationDelay: '2s',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            right: '20%',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.info.main} 0%, transparent 70%)`,
            opacity: 0.2,
            animation: `${floatAnimation} 5s ease-in-out infinite`,
            animationDelay: '1s',
          }}
        />

        <Grid container justifyContent="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={8} lg={6} xl={5}>
            <Card
              elevation={10}
              sx={{
                p: { xs: 2, sm: 4, md: 6 },
                borderRadius: 4,
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.15)`,
                border: '1px solid rgba(255, 255, 255, 0.18)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 12px 40px 0 rgba(31, 38, 135, 0.2)`,
                },
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    display: 'block',
                    width: '80px',
                    height: '4px',
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    margin: '16px auto',
                    borderRadius: '2px',
                  },
                }}
              >
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1,
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  Create New Exam
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Fill in the details to set up your examination
                </Typography>
              </Box>

              <ExamForm formik={formik} onSubmit={handleSubmit} isLoading={isLoading} />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default CreateExamPage;

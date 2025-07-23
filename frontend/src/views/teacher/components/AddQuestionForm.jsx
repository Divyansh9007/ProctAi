import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Select,
  MenuItem,
  Typography,
  Card,
  Paper,
  Chip,
  Divider,
  useTheme,
  Fade,
  Grow,
  Slide,
} from '@mui/material';
import swal from 'sweetalert';
import { useCreateQuestionMutation, useGetExamsQuery } from 'src/slices/examApiSlice';
import { toast } from 'react-toastify';
import { keyframes } from '@emotion/react';

// Animation keyframes
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const AddQuestionForm = () => {
  const theme = useTheme();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctOptions, setCorrectOptions] = useState([false, false, false, false]);
  const [selectedExamId, setSelectedExamId] = useState('');

  const handleOptionChange = (index) => {
    const updatedCorrectOptions = [...correctOptions];
    updatedCorrectOptions[index] = !correctOptions[index];
    setCorrectOptions(updatedCorrectOptions);
  };

  const [createQuestion, { isLoading }] = useCreateQuestionMutation();
  const { data: examsData } = useGetExamsQuery();

  useEffect(() => {
    if (examsData && examsData.length > 0) {
      setSelectedExamId(examsData[0].examId);
    }
  }, [examsData]);

  const handleAddQuestion = async () => {
    if (newQuestion.trim() === '' || newOptions.some((option) => option.trim() === '')) {
      swal('', 'Please fill out the question and all options.', 'error');
      return;
    }

    const newQuestionObj = {
      question: newQuestion,
      options: newOptions.map((option, index) => ({
        optionText: option,
        isCorrect: correctOptions[index],
      })),
      examId: selectedExamId,
    };

    try {
      const res = await createQuestion(newQuestionObj).unwrap();
      if (res) {
        toast.success('Question added successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
      setQuestions([...questions, res]);
      setNewQuestion('');
      setNewOptions(['', '', '', '']);
      setCorrectOptions([false, false, false, false]);
    } catch (err) {
      swal('', 'Failed to create question. Please try again.', 'error');
    }
  };

  const handleSubmitQuestions = () => {
    setQuestions([]);
    setNewQuestion('');
    setNewOptions(['', '', '', '']);
    setCorrectOptions([false, false, false, false]);
    toast.info('Questions submitted successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.1)`,
          border: '1px solid rgba(255, 255, 255, 0.18)',
          '&:hover': {
            boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.2)`,
          },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 3,
            textAlign: 'center',
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Add New Questions
        </Typography>

        <Select
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          fullWidth
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.dark,
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: 1,
                boxShadow: theme.shadows[4],
                '& .MuiMenuItem-root': {
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                  },
                },
              },
            },
          }}
        >
          {examsData &&
            examsData.map((exam) => (
              <MenuItem key={exam.examId} value={exam.examId}>
                {exam.examName}
              </MenuItem>
            ))}
        </Select>

        {questions.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
              Added Questions ({questions.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {questions.map((questionObj, questionIndex) => (
              <Grow in={true} key={questionIndex}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {questionObj.question}
                  </Typography>
                  <Stack spacing={1}>
                    {questionObj.options.map((option, optionIndex) => (
                      <Box
                        key={optionIndex}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          pl: 1,
                          backgroundColor: option.isCorrect
                            ? `${theme.palette.success.light}30`
                            : 'transparent',
                          borderRadius: 1,
                        }}
                      >
                        <Chip
                          label={`Option ${optionIndex + 1}`}
                          size="small"
                          sx={{
                            mr: 1,
                            backgroundColor: option.isCorrect
                              ? theme.palette.success.main
                              : theme.palette.grey[300],
                            color: option.isCorrect
                              ? theme.palette.success.contrastText
                              : theme.palette.text.primary,
                          }}
                        />
                        <Typography variant="body2">{option.optionText}</Typography>
                        {option.isCorrect && (
                          <Chip label="Correct" size="small" color="success" sx={{ ml: 'auto' }} />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grow>
            ))}
          </Box>
        )}

        <TextField
          label="Question Text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.dark,
              },
            },
          }}
          InputLabelProps={{
            style: { color: theme.palette.text.secondary },
          }}
        />

        <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>
          Options (Mark correct answers)
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {newOptions.map((option, index) => (
            <Slide direction="up" in={true} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: correctOptions[index]
                    ? `${theme.palette.success.light}20`
                    : 'transparent',
                  border: `1px solid ${
                    correctOptions[index] ? theme.palette.success.main : theme.palette.divider
                  }`,
                  transition: 'all 0.3s ease',
                }}
              >
                <TextField
                  label={`Option ${index + 1}`}
                  value={newOptions[index]}
                  onChange={(e) => {
                    const updatedOptions = [...newOptions];
                    updatedOptions[index] = e.target.value;
                    setNewOptions(updatedOptions);
                  }}
                  fullWidth
                  size="small"
                  sx={{ flex: 1 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={correctOptions[index]}
                      onChange={() => handleOptionChange(index)}
                      color="success"
                      sx={{
                        '&.Mui-checked': {
                          color: theme.palette.success.main,
                        },
                      }}
                    />
                  }
                  label="Correct"
                  sx={{ m: 0 }}
                />
              </Box>
            </Slide>
          ))}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleAddQuestion}
            disabled={isLoading}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                animation: `${pulseAnimation} 1s infinite`,
                boxShadow: `0 4px 20px 0 rgba(0, 0, 0, 0.2)`,
              },
            }}
          >
            {isLoading ? 'Adding...' : 'Add Question'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleSubmitQuestions}
            disabled={questions.length === 0}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}10`,
                borderColor: theme.palette.primary.dark,
              },
            }}
          >
            Submit All
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default AddQuestionForm;

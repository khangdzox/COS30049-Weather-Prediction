import { Box, Typography, ListItemText } from '@mui/material';
import React from 'react';

const About = () => {
  return (
    <Box sx={{ backgroundColor: '#d4f5d4', padding: '20px', textAlign: 'left' }}>
      <Typography variant="h2" gutterBottom align='center'>About Us</Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to our project page! We are <strong>SEA Group</strong>, a team of passionate computer science students specializing in <strong>Full-Stack Web Development and AI applications</strong> as part of our Bachelor's studies. Under the expert guidance of <strong>Mr. Hao Zhang</strong>, our tutor, we’ve tackled complex challenges in software development and successfully completed two major assignments, enhancing our skills and understanding in the field.
      </Typography>

      <Typography variant="h4" gutterBottom>Meet the Team</Typography>

      <ul>
        <li>
          <ListItemText>
            <Typography variant="h6">Brathaban</Typography>
            <Typography variant="body1"><strong>Role:</strong> Front-End Development Specialist</Typography>
            <Typography variant="body1"><strong>Location:</strong> Melbourne, Australia</Typography>
            <Typography variant="body1">Brathaban leads the front-end development efforts, creating interactive, responsive, and user-friendly interfaces. His attention to detail and focus on user experience ensures that our applications not only look good but are also intuitive and accessible.</Typography>
          </ListItemText>
        </li>

        <li>
          <ListItemText>
            <Typography variant="h6">Leonald Emmanuel Ling Ji Zheng</Typography>
            <Typography variant="body1"><strong>Role:</strong> FastAPI & Back-End Specialist</Typography>
            <Typography variant="body1"><strong>Location:</strong> Malaysia</Typography>
            <Typography variant="body1">Leonald specializes in FastAPI and back-end development, ensuring that our applications have a strong, efficient, and secure foundation. His expertise in API development enables seamless communication between the front end and back end, making our applications perform smoothly and effectively.</Typography>
          </ListItemText>
        </li>

        <li>
          <ListItemText>
            <Typography variant="h6">Khang Vo</Typography>
            <Typography variant="body1"><strong>Role:</strong> AI Integration Specialist</Typography>
            <Typography variant="body1"><strong>Location:</strong> Vietnam</Typography>
            <Typography variant="body1">Khang brings AI-driven intelligence to our applications. His knowledge in AI and machine learning allows us to incorporate advanced features that adapt and respond to user needs, adding value and enhancing the overall functionality of our projects.</Typography>
          </ListItemText>
        </li>
      </ul>

      <Typography variant="h4" gutterBottom>Our Journey</Typography>

      <Typography variant="body1" gutterBottom>
        Throughout our journey, we have applied our combined skills to develop robust, user-centered applications. We work collaboratively to analyze problems, share knowledge, and find solutions together. With each assignment, we've grown stronger as a team and gained valuable hands-on experience in full-stack development and AI-driven applications.
      </Typography>

      <Typography variant="h4" gutterBottom>Looking Ahead</Typography>

      <Typography variant="body1" gutterBottom>
        As we continue to explore the fields of web development and artificial intelligence, we remain committed to pushing boundaries, learning new technologies, and delivering quality applications. We invite you to follow our journey as we take on new challenges and aim for excellence in our studies and far beyond!
      </Typography>

      <Typography variant="body1" gutterBottom>
        Let's keep building the future of technology together!
      </Typography>
    </Box>
  );
};

export default About;

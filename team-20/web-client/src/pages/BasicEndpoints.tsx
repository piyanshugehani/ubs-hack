import React, { useState, useEffect } from "react";
import { Box, Card, Container, Grid, Typography, List, ListItem, Paper } from "@mui/material";

const API_URL = "http://127.0.0.1:5000";

interface Volunteer {
  volunteer_id: number;
  name: string;
  email?: string;
  phone?: string;
  rating: number;
  skills: { [key: string]: number };
  languages: { code: string; level: string }[];
  availability: { day_of_week: string; start_time: string; end_time: string }[];
  student_retention: number;
  experience: number;
}

interface RecommendedSlot {
  slot_id: number;
  chapter_title: string;
  subject: string;
  language: string;
  matchScore: number;
  matchReason: string;
  assignedOrNot: string;
  schedule?: { day: string; time: string };
}

const BasicEndpoints: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [recommendedSlots, setRecommendedSlots] = useState<RecommendedSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async <T,>(endpoint: string, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data: T[] = await response.json();
      setter(data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      setError(`Failed to fetch ${endpoint}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData<Volunteer>("volunteers", setVolunteers);
  }, []);

  const handleVolunteerSelect = async (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    await handleRecommendSlots(volunteer.volunteer_id);
  };

  const handleRecommendSlots = async (volunteerId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/recommend_slots?volunteer_id=${volunteerId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setRecommendedSlots(data.recommended_slots || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to fetch slot recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Volunteer Matching System
      </Typography>

      <Grid container spacing={3}>
        {/* Volunteers List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>Volunteers</Typography>
            <List>
              {volunteers.map((volunteer) => (
                <ListItem
                  key={volunteer.volunteer_id}
                  sx={{
                    mb: 1,
                    bgcolor: selectedVolunteer?.volunteer_id === volunteer.volunteer_id ? "action.selected" : "background.paper",
                    borderRadius: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => handleVolunteerSelect(volunteer)}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="subtitle1">{volunteer.name}</Typography>
                    <Typography variant="body2">Rating: {volunteer.rating}/5</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Volunteer Profile & Recommended Slots */}
        <Grid item xs={12} md={8}>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          {selectedVolunteer && (
            <>
              {/* Volunteer Profile */}
              <Card sx={{ p: 3, mb: 2 }}>
                <Typography variant="h5" gutterBottom>{selectedVolunteer.name}'s Profile</Typography>
                <Typography><strong>Email:</strong> {selectedVolunteer.email || "Not provided"}</Typography>
                <Typography><strong>Phone:</strong> {selectedVolunteer.phone || "Not provided"}</Typography>
                <Typography><strong>Rating:</strong> {selectedVolunteer.rating}/5</Typography>
                <Typography><strong>Experience:</strong> {selectedVolunteer.experience} years</Typography>
                <Typography><strong>Student Retention:</strong> {selectedVolunteer.student_retention}%</Typography>
                
                {/* Skills */}
                <Typography variant="h6" sx={{ mt: 2 }}>Skills</Typography>
                {Object.entries(selectedVolunteer.skills).map(([skill, level]) => (
                  <Typography key={skill}>{skill}: {level}/10</Typography>
                ))}

                {/* Languages */}
                <Typography variant="h6" sx={{ mt: 2 }}>Languages</Typography>
                <Typography>
                  {selectedVolunteer.languages.map(lang => `${lang.code} (${lang.level})`).join(", ")}
                </Typography>

                {/* Availability */}
                <Typography variant="h6" sx={{ mt: 2 }}>Availability</Typography>
                {selectedVolunteer.availability.length > 0 ? (
                  selectedVolunteer.availability.map((avail, index) => (
                    <Typography key={index}>
                      {avail.day_of_week}: {avail.start_time} - {avail.end_time}
                    </Typography>
                  ))
                ) : (
                  <Typography>No availability set</Typography>
                )}
              </Card>

              {/* Recommended Slots */}
              {recommendedSlots.length > 0 && (
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h5" gutterBottom>Recommended Slots</Typography>
                  <Grid container spacing={2}>
                    {recommendedSlots.map((slot) => (
                      <Grid item xs={12} key={slot.slot_id}>
                        <Card sx={{ p: 2 }}>
                          <Typography variant="h6">Slot {slot.slot_id}</Typography>
                          <Typography><strong>Chapter:</strong> {slot.chapter_title} ({slot.subject})</Typography>
                          <Typography><strong>Language:</strong> {slot.language}</Typography>
                          <Typography><strong>Match Score:</strong> {slot.matchScore}%</Typography>
                          <Typography><strong>Reason:</strong> {slot.matchReason}</Typography>
                          {/* <Typography><strong>Assigned:</strong> {slot.assignedOrNot}</Typography> */}
                          {slot.schedule && (
                            <Typography>
                              <strong>Schedule:</strong> {slot.schedule.day} at {slot.schedule.time}
                            </Typography>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default BasicEndpoints;

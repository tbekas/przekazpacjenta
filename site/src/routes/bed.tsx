import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import Title from "../components/title";

export default function Bed() {
  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Title>Miejsce</Title>
      </Paper>
    </Grid>
  );
}

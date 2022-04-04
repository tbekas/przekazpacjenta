import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import Title from "../components/title";

const Main = () => {
  return (
    <>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240
          }}
        >
          <Title>Dasch</Title>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240
          }}
        >
          <Title>Allert</Title>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Title>Message</Title>
        </Paper>
      </Grid>
    </>
  );
};
export default Main;

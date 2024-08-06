import { Posts } from "./data";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

let Page = () => {
  return (
    <Stack spacing={3} sx={{ padding: 8 }}>
      {Posts?.map((post, index) => {
        return (
          <Card key={index}>
            <CardContent>
              <Stack spacing={3} sx={{ padding: 2 }}>
                <Typography variant="h4">{post?.title}</Typography>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={2}>
                    <Typography>{post?.user?.name}</Typography>
                    <Button>Follow</Button>
                  </Stack>
                  <Typography>{post?.user?.date}</Typography>
                </Stack>
                <Typography variant="p">{post?.description}</Typography>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

export default Page;

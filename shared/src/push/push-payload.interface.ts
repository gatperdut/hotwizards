export interface PushPayload {
  title: string;
  body: string;
  data: {
    url: string;
  };
}

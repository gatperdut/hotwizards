export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  data: {
    url: string;
  };
}

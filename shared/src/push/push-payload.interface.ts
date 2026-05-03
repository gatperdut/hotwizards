export interface PushPayload {
  notification: {
    title: string;
    body: string;
    icon?: string;
    data: {
      url: string;
    };
  };
}

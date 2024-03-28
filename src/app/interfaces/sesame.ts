export interface Sesame {
  _id: string;
  sesameId: string;
  submodel: string;
  userId: string;
  group: string;
  config: string;
  wanIp: string;
  wanPort: number;
  batteryPercentage: number;
  usages: Usages[];
  registerDate: Date;
}



export interface Usages {
  userId: string;
  date: Date;
}

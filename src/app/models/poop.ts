export class Poop {
  public _id: string;
  public userId: string;
  public name: string;
  public description: string;
  public rating: number;
  public date: Date;
  public fullAddr: string;
  public city: string;
  public longState: string;
  public likes: number;
  public dislikes: number;
  public comments: CommentJ[];


  constructor(_id: string, userId: string, name: string, description: string, rating: number, date: Date, fullAddr: string, city: string, longState: string, likes: number, dislikes: number, comments: CommentJ) {
    this._id = _id;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.rating = rating;
    this.date = date;
    this.fullAddr = fullAddr;
    this.city = city;
    this.longState = longState;
    this.likes = likes;
    this.dislikes = dislikes;
    this.comments = [{
      _id: comments._id,
      userId: userId,
      user: comments.user,
      text: comments.text,
      date: comments.date,
      likes: comments.likes,
      dislikes: comments.dislikes,
      replies: comments.replies
    }]
  }


}

export interface CommentJ {
  _id: string;
  userId: string;
  user: string;
  text: string;
  date: Date;
  likes: number;
  dislikes: number;
  replyClicked?: boolean;
  replies: Replies[];
}

export interface Replies {
  _id: string;
  userId: string;
  user: string;
  text: string;
  date: Date;
  likes: number;
  dislikes: number;
}

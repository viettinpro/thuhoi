export interface Staff {
  id: string;
  name: string;
  phone: string;
}

export type NoticeType = 'first' | 'second' | 'third';

export interface NoticeData {
  noticeType: NoticeType; // 'first', 'second', or 'third'
  logoUrl?: string;
  noticeNumber: string;
  noticeDate: string; // YYYY-MM-DD
  firstNoticeNumber?: string; // New field for 2nd notice
  firstNoticeDate?: string; // YYYY-MM-DD (For 2nd/3rd notice)
  secondNoticeDate?: string; // YYYY-MM-DD (For 3rd notice)
  customerName: string;
  contractCode: string;
  contractDate: string; // YYYY-MM-DD
  overdueDays: number;
  monthlyPayment: number;
  overduePrincipal: number;
  penaltyFee: number;
  totalDueDate: string; // YYYY-MM-DD
  paymentDeadline: string; // YYYY-MM-DD
  selectedStaffId: string;
}

export const initialNoticeData: NoticeData = {
  noticeType: 'first',
  logoUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRf_RFHxiuISYBZdaolJ9briPQuZl6JUuZa5_9p3QMhJPZ16zmVAlYGGJi3KNSxkzQjTiqmpv0NO6Dk-g7JYzLUQgINCDYZJfIcI1FOIBDVsls1rMiBryggVZ7jGJRNOyl9d3fCBzkcV7h_FP1owl3DPRb-nyvXBolWA74k6WA1UOfd6lvkqj80MQ_qlAH/s1600/logo.png',
  noticeNumber: '',
  noticeDate: new Date().toISOString().split('T')[0],
  firstNoticeNumber: '',
  firstNoticeDate: '',
  secondNoticeDate: '',
  customerName: '',
  contractCode: '',
  contractDate: '',
  overdueDays: 0,
  monthlyPayment: 0,
  overduePrincipal: 0,
  penaltyFee: 0,
  totalDueDate: new Date().toISOString().split('T')[0],
  paymentDeadline: '',
  selectedStaffId: '',
};

import dayjs from 'dayjs'

const today = dayjs()

export const staffMembers = [
  { id:1, name:'Hamza Hassan',  role:'staff', email:'hamza@thecitypharma.com', phone:'+880 1711-000002', shift:'Morning',   salesCount:45, revenue:24810, avatar:'HH', status:'active', joinedDate:'2023-03-15' },
  { id:2, name:'Rahim Uddin',   role:'staff', email:'rahim@thecitypharma.com',  phone:'+880 1811-000003', shift:'Afternoon', salesCount:38, revenue:19744, avatar:'RU', status:'active', joinedDate:'2023-07-01' },
  { id:3, name:'Karim Hossain', role:'staff', email:'karim@thecitypharma.com',  phone:'+880 1911-000004', shift:'Evening',   salesCount:29, revenue:15136, avatar:'KH', status:'active', joinedDate:'2024-01-10' },
]

export const salesData = [
  { date: today.subtract(6,'day').format('MMM D'), revenue:24810, invoices:28, cash:12400, card:9010,  mobile:3400 },
  { date: today.subtract(5,'day').format('MMM D'), revenue:19744, invoices:22, cash:8000,  card:7744,  mobile:4000 },
  { date: today.subtract(4,'day').format('MMM D'), revenue:31600, invoices:35, cash:16000, card:11600, mobile:4000 },
  { date: today.subtract(3,'day').format('MMM D'), revenue:22415, invoices:26, cash:10415, card:8000,  mobile:4000 },
  { date: today.subtract(2,'day').format('MMM D'), revenue:42006, invoices:42, cash:19006, card:16000, mobile:7000 },
  { date: today.subtract(1,'day').format('MMM D'), revenue:33016, invoices:31, cash:14016, card:13000, mobile:6000 },
  { date: today.format('MMM D'),                   revenue:17808, invoices:19, cash:7808,  card:7000,  mobile:3000 },
]

export const recentInvoices = [
  { id:'INV-2024-089', customer:'Fatema Begum',     amount:310,  method:'Cash',   staff:'Hamza Hassan', time:'09:14 AM', status:'paid' },
  { id:'INV-2024-088', customer:'Walk-in Customer', amount:900,  method:'Card',   staff:'Hamza Hassan', time:'09:02 AM', status:'paid' },
  { id:'INV-2024-087', customer:'Mohammad Karim',   amount:460,  method:'bKash',  staff:'Rahim Uddin',  time:'08:55 AM', status:'paid' },
  { id:'INV-2024-086', customer:'Sumaiya Islam',    amount:1180, method:'Cash',   staff:'Hamza Hassan', time:'08:41 AM', status:'paid' },
  { id:'INV-2024-085', customer:'Walk-in Customer', amount:250,  method:'Nagad',  staff:'Rahim Uddin',  time:'08:30 AM', status:'paid' },
]

export const auditLog = [
  { id:1, action:'Inventory Update',       detail:'Paracetamol 500mg stock increased by 200 units.',          user:'Sahreyar Ahmed', time:'2024-06-22 08:30', severity:'info'    },
  { id:2, action:'Invoice Deleted',        detail:'INV-2024-077 (৳640) has been permanently deleted.',         user:'Sahreyar Ahmed', time:'2024-06-21 17:45', severity:'warning' },
  { id:3, action:'Staff Account Created',  detail:'New staff account created for Karim Hossain.',             user:'Sahreyar Ahmed', time:'2024-06-20 10:15', severity:'info'    },
  { id:4, action:'Manual Stock Adjustment',detail:'Amoxicillin stock manually reduced from 350 to 320 units.',user:'Sahreyar Ahmed', time:'2024-06-20 09:00', severity:'warning' },
  { id:5, action:'Settings Changed',       detail:'VAT rate updated from 8% to 15%.',                         user:'Sahreyar Ahmed', time:'2024-06-19 14:22', severity:'info'    },
]

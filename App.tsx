import React, { useState, useEffect } from 'react';
import NoticeForm from './components/NoticeForm';
import NoticePreview from './components/NoticePreview';
import { NoticeData, initialNoticeData, Staff } from './types';
import { FileText } from 'lucide-react';
import { fetchStaffList } from './utils';

const App: React.FC = () => {
  const [formData, setFormData] = useState<NoticeData>(initialNoticeData);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  useEffect(() => {
    const loadStaff = async () => {
      const list = await fetchStaffList();
      if (list.length > 0) {
        setStaffList(list);
      }
    };
    loadStaff();
  }, []);

  const handleInputChange = (key: keyof NoticeData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
      if(window.confirm('Bạn có chắc chắn muốn xóa hết dữ liệu đang nhập?')) {
          setFormData(initialNoticeData);
      }
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans print:bg-white">
      
      {/* Navbar - Hidden on print */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 print:hidden sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded text-white">
            <FileText size={24} />
          </div>
          <div>
             <h1 className="text-xl font-bold text-gray-900">Trình tạo Thông Báo Thanh Toán</h1>
             <p className="text-xs text-gray-500">Công ty Cổ Phần Giải Pháp Thanh Toán Việt Tín</p>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 print:p-0">
        <div className="flex flex-col lg:flex-row gap-6 print:block">
          
          {/* Left Column: Form - Hidden on print */}
          <div className="w-full lg:w-4/12 xl:w-3/12 print:hidden">
            <NoticeForm 
                data={formData} 
                onChange={handleInputChange} 
                onPrint={handlePrint}
                onReset={handleReset}
                staffList={staffList}
            />
          </div>

          {/* Right Column: Preview - Full width on print */}
          <div className="w-full lg:w-8/12 xl:w-9/12 print:w-full">
            {/* Visual Header for Preview Area */}
            <div className="bg-gray-800 text-white px-4 py-2 rounded-t-lg flex justify-between items-center print:hidden">
                <span className="text-sm font-medium">Xem trước (A4)</span>
                <span className="text-xs text-gray-400">Nội dung tự động cập nhật khi nhập liệu</span>
            </div>
            
            {/* The actual letter container */}
            <div className="overflow-x-auto bg-gray-500/10 p-4 rounded-b-lg print:p-0 print:bg-white print:overflow-visible">
                <NoticePreview data={formData} staffList={staffList} />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default App;
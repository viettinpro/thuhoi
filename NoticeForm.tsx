import React, { useState } from 'react';
import { NoticeData, Staff, NoticeType } from '../types';
import { Printer, RefreshCcw, Search, Loader2 } from 'lucide-react';
import { formatCurrency, findCustomerByContractCode } from '../utils';

interface NoticeFormProps {
  data: NoticeData;
  onChange: (key: keyof NoticeData, value: string | number) => void;
  onPrint: () => void;
  onReset: () => void;
  staffList: Staff[];
}

const NoticeForm: React.FC<NoticeFormProps> = ({ data, onChange, onPrint, onReset, staffList }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      onChange(name as keyof NoticeData, value === '' ? 0 : parseFloat(value));
    } else {
      onChange(name as keyof NoticeData, value);
    }
  };

  const handleTypeChange = (type: NoticeType) => {
    onChange('noticeType', type);
  };

  const handleSearch = async () => {
    if (!data.contractCode) {
      setSearchError('Vui lòng nhập Mã hợp đồng');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const result = await findCustomerByContractCode(data.contractCode);
      if (result) {
        onChange('customerName', result.customerName);
        onChange('monthlyPayment', result.monthlyPayment);
        onChange('penaltyFee', result.penaltyFee);
        onChange('overdueDays', result.overdueDays);
        setSearchError(''); // Clear error if success
      } else {
        setSearchError('Không tìm thấy hợp đồng này trong hệ thống.');
      }
    } catch (error) {
      setSearchError('Lỗi kết nối tới Google Sheet. Hãy kiểm tra quyền truy cập.');
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-calculate total due: ONLY Overdue Principal + Penalty Fee
  const calculatedTotalDue = (data.overduePrincipal || 0) + (data.penaltyFee || 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Nhập Thông Tin</h2>
        <button onClick={onReset} className="text-gray-500 hover:text-gray-700" title="Làm mới">
            <RefreshCcw size={18} />
        </button>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex p-1 bg-gray-100 rounded-lg mb-6 gap-1">
        <button
            onClick={() => handleTypeChange('first')}
            className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${
                data.noticeType === 'first' 
                ? 'bg-white text-blue-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            Lần 1
        </button>
        <button
            onClick={() => handleTypeChange('second')}
            className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${
                data.noticeType === 'second' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            Lần 2
        </button>
        <button
            onClick={() => handleTypeChange('third')}
            className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${
                data.noticeType === 'third' 
                ? 'bg-white text-red-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            Lần 3 (Chốt)
        </button>
      </div>

      <div className="space-y-4">
        {/* Section 1: General Info */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số thông báo</label>
                <input
                    type="text"
                    name="noticeNumber"
                    value={data.noticeNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 03"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày gửi</label>
                <input
                    type="date"
                    name="noticeDate"
                    value={data.noticeDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        {/* Conditional Field for Second Notice */}
        {data.noticeType === 'second' && (
            <div className="bg-orange-50 p-3 rounded-md border border-orange-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-orange-800 mb-1">Ngày gửi Lần 1 (Công văn số 01)</label>
                        <input
                            type="date"
                            name="firstNoticeDate"
                            value={data.firstNoticeDate || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                     </div>
                </div>
            </div>
        )}

        {/* Conditional Field for Third Notice */}
        {data.noticeType === 'third' && (
            <div className="bg-red-50 p-3 rounded-md border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                 <div>
                    <label className="block text-sm font-bold text-red-800 mb-1">Ngày gửi Lần 1 (Công văn số 01)</label>
                    <input
                        type="date"
                        name="firstNoticeDate"
                        value={data.firstNoticeDate || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-red-800 mb-1">Ngày gửi Lần 2 (Công văn số 02)</label>
                    <input
                        type="date"
                        name="secondNoticeDate"
                        value={data.secondNoticeDate || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                 </div>
            </div>
        )}

        {/* Section: Contract Search */}
        <div className="bg-blue-50 p-3 rounded-md border border-blue-100 shadow-sm">
             <label className="block text-sm font-bold text-blue-800 mb-2">Tìm kiếm Mã hợp đồng (Google Sheet)</label>
             <div className="flex gap-2 items-center">
                <input
                    type="text"
                    name="contractCode"
                    value={data.contractCode}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mã HĐ..."
                />
                <button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-md flex items-center justify-center transition-colors shadow-sm"
                    title="Tìm kiếm"
                >
                    {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                </button>
             </div>
             {searchError && <p className="text-xs text-red-600 mt-2">{searchError}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
             {/* Customer Name */}
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
                <input
                    type="text"
                    name="customerName"
                    value={data.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tự động điền..."
                />
            </div>
            
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hợp đồng</label>
                <input
                    type="date"
                    name="contractDate"
                    value={data.contractDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex items-end">
                <span className="text-xs text-gray-400 italic mb-3 ml-1">Lưu ý: Điền thủ công</span>
            </div>
        </div>

        {/* Section 3: Financials */}
        <div className="p-4 bg-gray-50 rounded-md space-y-3 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Chi tiết công nợ</h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500">Số ngày trễ hạn</label>
                    <input
                        type="number"
                        name="overdueDays"
                        value={data.overdueDays}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500"
                    />
                </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-500">Thanh toán hàng tháng (VNĐ)</label>
                    <input
                        type="number"
                        name="monthlyPayment"
                        value={data.monthlyPayment}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500">Gốc quá hạn (VNĐ)</label>
                    <input
                        type="number"
                        name="overduePrincipal"
                        value={data.overduePrincipal}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500">Tổng phí phạt (VNĐ)</label>
                    <input
                        type="number"
                        name="penaltyFee"
                        value={data.penaltyFee}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tính đến ngày (Cho dòng tổng cộng)</label>
                    <input
                        type="date"
                        name="totalDueDate"
                        value={data.totalDueDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-red-600 mb-1">TỔNG CỘNG PHẢI ĐÓNG (TỰ ĐỘNG)</label>
                    <div className="w-full px-3 py-2 bg-red-50 border-2 border-red-100 rounded-md text-red-700 font-bold text-lg">
                        {formatCurrency(calculatedTotalDue)} VNĐ
                    </div>
                </div>
            </div>
        </div>

        {/* Section 4: Action */}
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hạn thanh toán</label>
                <input
                    type="date"
                    name="paymentDeadline"
                    value={data.paymentDeadline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhân viên hỗ trợ</label>
                <select
                    name="selectedStaffId"
                    value={data.selectedStaffId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Chọn nhân viên --</option>
                    {staffList.map((staff: Staff) => (
                        <option key={staff.id} value={staff.id}>
                            {staff.name}
                        </option>
                    ))}
                </select>
                {staffList.length === 0 && <p className="text-xs text-orange-500 mt-1">Đang tải danh sách hoặc trống...</p>}
            </div>
        </div>

        <div className="pt-6">
            <button
                onClick={onPrint}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors shadow-md"
            >
                <Printer size={20} />
                In Thư Thông Báo
            </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeForm;
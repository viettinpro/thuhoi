import React from 'react';
import { NoticeData, Staff } from '../types';
import { COMPANY_INFO } from '../constants';
import { formatCurrency, formatDateToVietnamese } from '../utils';
import { Diamond } from 'lucide-react';

interface NoticePreviewProps {
  data: NoticeData;
  staffList: Staff[];
}

const NoticePreview: React.FC<NoticePreviewProps> = ({ data, staffList }) => {
  const staff = staffList.find(s => s.id === data.selectedStaffId);
  const noticeDateObj = formatDateToVietnamese(data.noticeDate);
  const contractDateObj = formatDateToVietnamese(data.contractDate);
  const deadlineDateObj = formatDateToVietnamese(data.paymentDeadline);
  const firstNoticeDateObj = formatDateToVietnamese(data.firstNoticeDate || '');
  const secondNoticeDateObj = formatDateToVietnamese(data.secondNoticeDate || '');
  
  // Format total due date specifically as DD/MM/YYYY
  const totalDueDateObj = formatDateToVietnamese(data.totalDueDate);
  const totalDueDateString = totalDueDateObj.day === '...' ? '.../.../...' : `${totalDueDateObj.day}/${totalDueDateObj.month}/${totalDueDateObj.year}`;

  // Calculate total automatically: Only Overdue Principal + Penalty Fee
  const totalDue = (data.overduePrincipal || 0) + (data.penaltyFee || 0);

  // Determine year for Notice Number (Use selected date's year, fallback to current year)
  const noticeYear = noticeDateObj.year === '...' ? new Date().getFullYear() : noticeDateObj.year;

  // Render content logic based on notice type
  // Fix: print:p-[2cm] ensures proper margin on paper instead of print:p-0
  return (
    <div className="bg-white text-black font-serif p-10 md:p-[2cm] max-w-[210mm] mx-auto shadow-2xl print:shadow-none print:max-w-none print:w-full print:p-[2cm] leading-relaxed text-[13pt]">
      
      {/* Header Section - Always the same */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-5/12 text-center flex flex-col items-center">
            {/* Logo Section */}
           <div className="flex items-center justify-center mb-2">
                {data.logoUrl ? (
                    <img src={data.logoUrl} alt="Company Logo" className="max-w-[180px] h-auto object-contain" />
                ) : (
                    <div className="flex flex-col items-center opacity-50">
                         {/* Fallback Placeholder if no image is uploaded */}
                        <div className="relative">
                            <Diamond className="text-red-700 w-12 h-12 fill-red-700/20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-bold text-green-800 text-xs mt-1 ml-4">VIET TIN</span>
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 italic">(Chưa chọn logo)</span>
                    </div>
                )}
           </div>
          <h1 className="font-bold text-sm uppercase leading-tight text-green-900">
            CÔNG TY CỔ PHẦN<br/>GIẢI PHÁP THANH TOÁN VIỆT TÍN
          </h1>
          <div className="w-1/2 h-[1px] bg-gray-400 mt-2 mb-2"></div>
          <p className="italic text-sm">
            Số: {data.noticeNumber || '...'} /{noticeYear}<br/>
            Về việc: Đề nghị khách hàng thanh toán
          </p>
        </div>

        <div className="w-6/12 text-center">
          <h2 className="font-bold uppercase text-sm mb-1">CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
          <p className="font-bold underline underline-offset-4 text-sm mb-4">Độc lập – Tự do – Hạnh Phúc</p>
          
          <p className="italic text-right mt-6 mr-4">
            HCM, {noticeDateObj.full}
          </p>
        </div>
      </div>

      {/* Recipient - CENTERED */}
      <div className="mb-6 text-center">
        <p className="font-bold">Kính gửi: Khách hàng <span className="text-red-600 uppercase">{data.customerName || '...'}</span></p>
      </div>

      {/* Body Content Wrapper */}
      <div className="w-full">
            <div className="space-y-3 text-justify">
                <p className="indent-8">
                Đầu tiên, {COMPANY_INFO.name} (<i>sau đây gọi tắt là {COMPANY_INFO.shortName}</i>) xin gửi lời chào trân trọng và lời chúc sức khỏe đến quý khách hàng ông (bà) <span className="font-bold">{data.customerName || '...'}</span>.
                </p>

                {/* --- CONTENT FOR FIRST NOTICE --- */}
                {data.noticeType === 'first' && (
                    <>
                        <p className="indent-8">
                            {contractDateObj.year === '...' ? 'Ngày ... tháng ... năm ...' : `Ngày ${contractDateObj.day} tháng ${contractDateObj.month} năm ${contractDateObj.year}`} giữa {COMPANY_INFO.shortName} và ông(bà) có giao kết Hợp đồng số: <span className="font-bold text-red-600">{data.contractCode || '...'}</span>
                        </p>

                        <p className="indent-8">
                            Hiện, quý khách hàng có khoản thanh toán đến hạn phải thanh toán cho {COMPANY_INFO.shortName} như sau:
                        </p>
                        
                        <ul className="list-none pl-12 space-y-1">
                            <li>- Số ngày trễ hạn: <span className="font-bold text-red-600">{data.overdueDays > 0 ? data.overdueDays : '...'}</span> ngày</li>
                            <li>- Số tiền phải thanh toán hàng tháng: <span className="font-bold text-red-600">{formatCurrency(data.monthlyPayment)}</span> VND</li>
                            <li>- Tổng số tiền gốc bị quá hạn đến ngày: {totalDueDateString} là <span className="font-bold text-red-600">{formatCurrency(data.overduePrincipal)}</span> VND</li>
                            <li>- Tổng số tiền phí phạt quá hạn đến ngày: {totalDueDateString} là <span className="font-bold text-red-600">{formatCurrency(data.penaltyFee)}</span> VND</li>
                            <li>- Tổng cộng đến ngày: {totalDueDateString} phải đóng : <span className="font-bold text-red-600 text-lg">{formatCurrency(totalDue)}</span> VND</li>
                        </ul>

                        <p className="indent-8">
                        Để không bị phát sinh phí trễ, phí phạt hợp đồng, tiền lãi chậm trả.
                        </p>

                        <p className="indent-8">
                            Bằng văn bản này, {COMPANY_INFO.shortName} rất mong quý khách hàng ông (bà) <span className="font-bold">{data.customerName || '...'}</span> thanh toán số tiền <span className="font-bold text-red-600">{formatCurrency(totalDue)}</span> VND trước {deadlineDateObj.full} để tránh phí trễ, phí phạt hợp đồng, tiền lãi chậm trả.
                        </p>
                    </>
                )}

                {/* --- CONTENT FOR SECOND NOTICE --- */}
                {data.noticeType === 'second' && (
                    <>
                        <p className="indent-8">
                        Vừa qua, {COMPANY_INFO.shortName} có gửi cho quý khách hàng ông (bà) <span className="font-bold">{data.customerName || '...'}</span> công văn số: <span className="font-bold">01</span> ngày <span className="font-bold">{firstNoticeDateObj.day !== '...' ? `${firstNoticeDateObj.day}/${firstNoticeDateObj.month}/${firstNoticeDateObj.year}` : '.../.../....'}</span> về việc đề nghị thanh toán khoản trả chậm, trả dần.
                        </p>
                        
                        <p className="indent-8">
                            Đến nay, {COMPANY_INFO.shortName} vẫn chưa nhận được phản hồi của quý khách hàng ông (bà) <span className="font-bold">{data.customerName || '...'}</span> về khoản thanh toán trả chậm, trả dần, cụ thể như sau:
                        </p>

                        <ul className="list-none pl-12 space-y-1">
                            <li>- Số ngày trễ hạn: <span className="font-bold text-red-600">{data.overdueDays > 0 ? data.overdueDays : '...'}</span> ngày</li>
                            <li>- Số tiền phải thanh toán hàng tháng: <span className="font-bold text-red-600">{formatCurrency(data.monthlyPayment)}</span> VND</li>
                            <li>- Tổng số tiền gốc bị quá hạn đến ngày: {totalDueDateString} là <span className="font-bold text-red-600">{formatCurrency(data.overduePrincipal)}</span> VND</li>
                            <li>- Tổng số tiền phí phạt quá hạn đến ngày: {totalDueDateString} là <span className="font-bold text-red-600">{formatCurrency(data.penaltyFee)}</span> VND</li>
                            <li>- Tổng cộng đến ngày: {totalDueDateString} phải đóng : <span className="font-bold text-red-600 text-lg">{formatCurrency(totalDue)}</span> VND</li>
                        </ul>

                         <p className="indent-8">
                        Để không bị phát sinh phí trễ, phí phạt hợp đồng, tiền lãi chậm trả.
                        </p>

                        <p className="indent-8">
                            Một lần nữa, Bằng văn bản này, {COMPANY_INFO.shortName} rất mong quý khách hàng ông (bà) <span className="font-bold">{data.customerName || '...'}</span> thanh toán số tiền <span className="font-bold text-red-600">{formatCurrency(totalDue)}</span> VND trước {deadlineDateObj.full} để tránh phí trễ, phí phạt hợp đồng, tiền lãi chậm trả.
                        </p>
                    </>
                )}

                {/* --- CONTENT FOR THIRD NOTICE --- */}
                {data.noticeType === 'third' && (
                    <>
                        <p className="indent-8">
                        Vừa qua, {COMPANY_INFO.shortName} đã gửi cho ông (bà) Công văn số: 01 ngày <span className="font-bold text-red-600">{firstNoticeDateObj.day !== '...' ? `${firstNoticeDateObj.day}/${firstNoticeDateObj.month}/${firstNoticeDateObj.year}` : '.../.../....'}</span> và Công văn số: 02 ngày <span className="font-bold text-red-600">{secondNoticeDateObj.day !== '...' ? `${secondNoticeDateObj.day}/${secondNoticeDateObj.month}/${secondNoticeDateObj.year}` : '.../.../....'}</span> về việc đề nghị thanh toán khoản trả chậm, trả dần.
                        </p>
                        
                        <p className="indent-8">
                        Đến nay, quý khách hàng ông (bà) <span className="font-bold">{data.customerName || '...'}</span> vẫn chưa thanh toán khoản trả chậm trả dần
                        </p>
                        
                        <p className="indent-8">
                        Căn cứ quy định định hợp đồng, hiện, ông (bà) đang vi phạm thời hạn thanh toán, cụ thể như sau:
                        </p>

                        <ul className="list-none pl-12 space-y-1">
                            <li>- Tổng cộng đến ngày: {totalDueDateString} phải thanh toán là <span className="font-bold text-red-600 text-lg">{formatCurrency(totalDue)}</span> VND</li>
                            <li>- Tổng số tiền gốc bị quá hạn đến ngày: {totalDueDateString} là <span className="font-bold text-red-600">{formatCurrency(data.overduePrincipal)}</span> VND</li>
                            <li>- Tổng số tiền phí phạt quá hạn đến ngày: {totalDueDateString} là <span className="font-bold text-red-600">{formatCurrency(data.penaltyFee)}</span> VND</li>
                            <li>- Số tiền phải thanh toán hàng tháng: <span className="font-bold text-red-600">{formatCurrency(data.monthlyPayment)}</span> VND</li>
                            <li>- Số ngày trễ hạn: <span className="font-bold text-red-600">{data.overdueDays > 0 ? data.overdueDays : '...'}</span> ngày</li>
                        </ul>

                        <p className="indent-8">
                            Bằng công văn này, một lần nữa, {COMPANY_INFO.shortName} xin lưu ý ông (bà) thanh toán số tiền là <span className="font-bold text-red-600">{formatCurrency(totalDue)}</span> VND trước {deadlineDateObj.full} để tránh bị phát sinh phí trễ, phí phạt hợp đồng, tiền lãi phát sinh và tránh bị các hậu quả pháp lý đáng tiếc không mong muốn có thể xảy ra với quý khách hàng.
                        </p>

                         <p className="indent-8">
                            Đến thời điểm hiện tại, {COMPANY_INFO.shortName} luôn mong muốn hợp tác, hỗ trợ tốt nhất cho quý khách hàng trên mọi phương diện. Tuy nhiên nếu quá thời hạn trên mà ông (bà) <span className="font-bold">{data.customerName || '...'}</span> vẫn không thực hiện nghĩa vụ thanh toán khoản trả chậm, trả dần, không phản hồi ý kiến cho chúng tôi được biết. Chúng tôi sẽ đề nghị cơ quan nhà nước có thẩm quyền hỗ trợ xác minh tài sản của ông (bà) theo quy định của pháp luật.
                        </p>

                         <p className="indent-8">
                            Nếu kết quả xác minh ông (bà) <span className="font-bold">{data.customerName || '...'}</span> có tài sản đến thời hạn trả lại tài sản mặc dù có điều kiện, khả năng nhưng cố tình không trả thì hành vi ông (bà) có thể cấu thành tội danh <i>“Lạm dụng tín nhiệm chiếm đoạt tài sản”</i> theo quy định tại Điều 175 Bộ Luật Hình Sự năm 2015.
                        </p>
                    </>
                )}


                {/* --- COMMON CONTACT INFO --- */}
                {data.noticeType !== 'third' ? (
                     <p className="indent-8">
                     {data.noticeType === 'second' 
                       ? `Kể từ ngày nhận được văn bản này, nếu quý khách hàng còn thắc mắc những vấn đề nào khác, đừng ngại liên hệ đến ${COMPANY_INFO.shortName} tiếp tục hỗ trợ khách hàng chu đáo hơn. Để được hỗ trợ tốt nhất, quý ông (bà) xin vui lòng liên hệ Nhân viên Chăm sóc khách hàng ` 
                       : `Nếu cần hỗ trợ mọi vấn đề và thông tin liên quan, quý khách hàng ông (bà) ${data.customerName || '...'} đừng ngần ngại và xin vui lòng liên hệ Nhân viên Chăm sóc khách hàng `}
                     <span className="font-bold text-red-600">{staff?.name || '...'}</span> của {COMPANY_INFO.shortName} qua số điện thoại <span className="font-bold text-red-600">{staff?.phone || '...'}</span> để được hướng dẫn, hỗ trợ kịp thời nhằm bảo vệ quyền lợi tốt nhất cho quý khách hàng.
                   </p>
                ) : (
                    <p className="indent-8">
                        Để được hỗ trợ tốt nhất, quý ông (bà) có thể liên hệ Nhân viên Chăm sóc khách hàng <span className="font-bold text-red-600">{staff?.name || '...'}</span> của {COMPANY_INFO.shortName} qua số điện thoại <span className="font-bold text-red-600">{staff?.phone || '...'}</span> để được hướng dẫn, hỗ trợ kịp thời nhằm bảo vệ quyền lợi tốt nhất cho quý khách hàng.
                    </p>
                )}
               
                <p className="indent-8">
                    Mong nhận được sự hợp tác từ quý ông (bà) <span className="font-bold">{data.customerName || '...'}</span>.
                </p>
                
                <p className="indent-8">
                    Trân trọng./.
                </p>
            </div>
            
             {/* Footer / Signature */}
            <div className="flex justify-between mt-12 mb-8">
                <div className="w-1/2 pl-4">
                <p className="font-bold underline mb-2">Nơi nhận:</p>
                {data.noticeType === 'third' ? (
                     <ul className="list-none italic text-sm space-y-1">
                        <li>- Lưu Hs.</li>
                     </ul>
                ) : (
                    <ul className="list-none italic text-sm space-y-1">
                        <li>- Khách hàng;</li>
                        <li>- Lưu Vt.</li>
                    </ul>
                )}
                
                </div>
                <div className="w-1/2 text-center">
                    <p className="font-bold uppercase">ĐẠI DIỆN CÔNG TY</p>
                    {data.noticeType !== 'third' && <p className="font-bold uppercase mb-20">{COMPANY_INFO.shortName}</p>}
                    {/* Space for signature if third notice */}
                    {data.noticeType === 'third' && <div className="h-20"></div>}
                </div>
            </div>

            {/* --- LEGAL TEXT FOOTER FOR THIRD NOTICE --- */}
            {data.noticeType === 'third' && (
                 <div className="mt-4 pt-2 border-t border-black w-full text-[10pt] leading-snug">
                    <p className="italic text-xs mb-3">Trích “Bộ Luật Hình Sự năm 2015”, có hiệu lực ngày 01/01/2017</p>
                    
                     <p className="font-bold mb-1">Điều 175. Tội lạm dụng tín nhiệm chiếm đoạt tài sản</p>
                     <p className="italic mb-1">
                        1. Người nào thực hiện một trong những hành vi sau đây chiếm đoạt tài sản của người khác trị giá từ 4.000.000 đồng đến dưới 50.000.000 đồng hoặc dưới 4.000.000 đồng ... thì bị phạt cải tạo không giam giữ đến 03 năm hoặc phạt tù từ 06 tháng đến 03 năm:
                     </p>
                     <ul className="list-none pl-0 space-y-1 italic mb-2">
                         <li>a) Vay, mượn, ... của người khác hoặc nhận được tài sản của người khác bằng các hình thức hợp đồng rồi dùng thủ đoạn gian dối chiếm đoạt tài sản đó hoặc đến thời hạn trả lại tài sản mặc dù có điều kiện, khả năng nhưng cố tình không trả;</li>
                         <li>b) Vay, mượn... tài sản của người khác hoặc nhận được tài sản của người khác bằng các hình thức hợp đồng và đã sử dụng tài sản đó vào mục đích bất hợp pháp dẫn đến không có khả năng trả lại tài sản.</li>
                     </ul>
                     <p className="italic mb-1">
                        2. Phạm tội thuộc một trong các trường hợp sau đây, thì bị phạt tù từ 02 năm đến 07 năm:
                     </p>
                      <ul className="list-none pl-0 space-y-0.5 italic">
                         <li>a) Có tổ chức;</li>
                         <li>b) Có tính chất chuyên nghiệp;</li>
                         <li>c) Chiếm đoạt tài sản trị giá từ 50.000.000 đồng đến dưới 200.000.000 đồng;</li>
                         <li>d) Lợi dụng chức vụ, quyền hạn hoặc lợi dụng danh nghĩa cơ quan, tổ chức;</li>
                         <li>đ) Dùng thủ đoạn xảo quyệt;</li>
                         <li>e) Tái phạm nguy hiểm.</li>
                         <li>.../</li>
                     </ul>
                 </div>
            )}
      </div>
      
      {/* Bottom marker for visual balance in preview */}
      <div className="text-center mt-4 text-xs text-gray-300 print:hidden">
         |
      </div>
    </div>
  );
};

export default NoticePreview;
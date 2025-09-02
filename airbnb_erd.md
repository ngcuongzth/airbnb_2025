# Mô hình Database Hoàn chỉnh - Airbnb Clone (Đã tối ưu)

## 1. Users (Bảng người dùng)
**Ý nghĩa**: Quản lý tất cả người dùng trong hệ thống (khách thuê, chủ nhà, admin)

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính duy nhất |
| name | String | Họ tên đầy đủ |
| email | String (unique) | Email đăng nhập, phải duy nhất |
| password | String | Mật khẩu đã mã hóa |
| phone | String | Số điện thoại |
| profileImageUrl | String | Đường dẫn ảnh đại diện |
| bio | String | Giới thiệu bản thân |
| address | String | Địa chỉ cư trú |
| birthday | Date | Ngày sinh |
| gender | String | Giới tính |
| languages | [String] | Danh sách ngôn ngữ biết |
| emailVerified | Boolean | Trạng thái xác thực email |
| phoneVerified | Boolean | Trạng thái xác thực SĐT |
| governmentIdVerified | Boolean | Trạng thái xác thực CMND/CCCD |
| isSuperhost | Boolean | Có phải superhost không |
| role | String | Vai trò: "guest", "host", "admin" |
| isActive | Boolean | Trạng thái tài khoản |
| lastLogin | Date | Lần đăng nhập cuối |
| createdAt | Date | Ngày tạo tài khoản |
| updatedAt | Date | Ngày cập nhật cuối |

---

## 2. Countries (Bảng quốc gia)
**Ý nghĩa**: Danh sách các quốc gia để phân loại địa lý

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| name | String | Tên quốc gia |
| code | String | Mã quốc gia (VN, US, FR...) |
| currency | String | Đơn vị tiền tệ |
| timezone | String | Múi giờ |
| createdAt | Date | Ngày tạo |

---

## 3. Cities (Bảng thành phố)
**Ý nghĩa**: Danh sách thành phố trong từng quốc gia

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| name | String | Tên thành phố |
| countryId | ObjectId (ref Countries) | Thuộc quốc gia nào |
| state | String | Bang/tỉnh/thành |
| coordinates | [Number] | Tọa độ [lng, lat] |
| timezone | String | Múi giờ địa phương |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

---

## 4. PropertyTypes (Bảng loại tài sản)
**Ý nghĩa**: Phân loại các loại hình bất động sản

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| name | String | Tên loại: "apartment", "house", "villa"... |
| description | String | Mô tả chi tiết |
| icon | String | Biểu tượng hiển thị |
| isActive | Boolean | Còn sử dụng không |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

---

## 5. Amenities (Bảng tiện ích)
**Ý nghĩa**: Danh sách các tiện ích có thể có trong nhà

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| name | String | Tên tiện ích: "WiFi", "Pool", "Kitchen"... |
| category | String | Nhóm: "basic", "features", "location", "safety" |
| icon | String | Biểu tượng hiển thị |
| description | String | Mô tả chi tiết |
| isActive | Boolean | Còn sử dụng không |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

---

## 6. CancellationPolicies (Bảng chính sách hủy)
**Ý nghĩa**: Các chính sách hủy đặt phòng khác nhau

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| name | String | Tên: "Flexible", "Moderate", "Strict" |
| description | String | Mô tả chính sách |
| refundPercentage | Number | % hoàn tiền (0-100) |
| daysBefore | Number | Số ngày trước khi checkin |
| isActive | Boolean | Còn áp dụng không |
| createdAt | Date | Ngày tạo |

---

## 7. Listings (Bảng danh sách cho thuê)
**Ý nghĩa**: Thông tin chi tiết về từng căn nhà/phòng cho thuê. (Lưu ý: Cần tạo index '2dsphere' cho trường 'coordinates' để tối ưu tìm kiếm địa lý).

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| hostId | ObjectId (ref Users) | Chủ nhà |
| propertyTypeId | ObjectId (ref PropertyTypes) | Loại tài sản |
| cityId | ObjectId (ref Cities) | Thành phố |
| title | String | Tiêu đề tin đăng |
| description | String | Mô tả chi tiết |
| address | String | Địa chỉ cụ thể |
| coordinates | [Number] | Tọa độ [lng, lat] |
| pricePerNight | Number | Giá mỗi đêm |
| cleaningFee | Number | Phí dọn dẹp |
| securityDeposit | Number | Tiền đặt cọc |
| currency | String | Đơn vị tiền tệ |
| weeklyDiscount | Number | Giảm giá theo tuần (%) |
| monthlyDiscount | Number | Giảm giá theo tháng (%) |
| maxGuests | Number | Số khách tối đa |
| bedrooms | Number | Số phòng ngủ |
| bathrooms | Number | Số phòng tắm |
| beds | Number | Số giường |
| squareMeters | Number | Diện tích (m²) |
| instantBookable | Boolean | Đặt ngay không cần duyệt |
| minimumStay | Number | Số đêm tối thiểu |
| maximumStay | Number | Số đêm tối đa |
| cancellationPolicyId | ObjectId (ref CancellationPolicies) | Chính sách hủy |
| checkInTime | String | Giờ nhận phòng |
| checkOutTime | String | Giờ trả phòng |
| houseRules | String | Nội quy nhà |
| smokingAllowed | Boolean | Cho phép hút thuốc |
| petsAllowed | Boolean | Cho phép thú cưng |
| partiesAllowed | Boolean | Cho phép tổ chức tiệc |
| status | String | "active", "inactive", "suspended" |
| amenities | [ObjectId] (ref Amenities) | Danh sách ID các tiện ích (nhúng) |
| avgRating | Number | Điểm đánh giá trung bình |
| totalReviews | Number | Tổng số đánh giá |
| totalBookings | Number | Tổng lượt đặt |
| viewCount | Number | Lượt xem |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

---

## 8. ListingImages (Bảng hình ảnh)
**Ý nghĩa**: Lưu trữ hình ảnh của từng listing

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| listingId | ObjectId (ref Listings) | Căn nhà |
| url | String | Đường dẫn hình ảnh |
| caption | String | Chú thích ảnh |
| order | Number | Thứ tự hiển thị |
| isCover | Boolean | Ảnh bìa hay không |
| createdAt | Date | Ngày tải lên |
| updatedAt | Date | Ngày cập nhật |

---

## 9. Availability (Bảng lịch trống)
**Ý nghĩa**: Quản lý lịch có sẵn và giá theo từng ngày

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| listingId | ObjectId (ref Listings) | Căn nhà |
| date | Date | Ngày cụ thể |
| isAvailable | Boolean | Còn trống không |
| price | Number | Giá riêng cho ngày này |
| minStay | Number | Số đêm tối thiểu |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

---

## 10. Bookings (Bảng đặt phòng)
**Ý nghĩa**: Lưu trữ thông tin các lần đặt phòng

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| listingId | ObjectId (ref Listings) | Căn nhà được đặt |
| guestId | ObjectId (ref Users) | Khách đặt phòng |
| listingTitle | String | Tiêu đề listing (denormalized) |
| listingCoverImageUrl | String | Ảnh bìa listing (denormalized) |
| listingAddress | String | Địa chỉ listing (denormalized) |
| hostId | ObjectId (ref Users) | Chủ nhà |
| checkIn | Date | Ngày nhận phòng |
| checkOut | Date | Ngày trả phòng |
| nights | Number | Số đêm |
| guests | Number | Số khách |
| baseAmount | Number | Tiền phòng gốc |
| cleaningFee | Number | Phí dọn dẹp |
| serviceFee | Number | Phí dịch vụ |
| taxes | Number | Thuế |
| totalAmount | Number | Tổng tiền |
| currency | String | Đơn vị tiền tệ |
| status | String | "pending", "confirmed", "cancelled", "completed" |
| paymentStatus | String | "pending", "paid", "refunded" |
| cancellationReason | String | Lý do hủy |
| cancellationPolicy | String | Chính sách hủy áp dụng |
| specialRequests | String | Yêu cầu đặc biệt |
| createdAt | Date | Ngày đặt |
| updatedAt | Date | Ngày cập nhật |

---

## 11. BookingHistory (Bảng lịch sử đặt phòng)
**Ý nghĩa**: Theo dõi các thay đổi trạng thái booking

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| bookingId | ObjectId (ref Bookings) | Booking liên quan |
| previousStatus | String | Trạng thái cũ |
| newStatus | String | Trạng thái mới |
| changedBy | ObjectId (ref Users) | Người thay đổi |
| reason | String | Lý do thay đổi |
| notes | String | Ghi chú thêm |
| createdAt | Date | Thời gian thay đổi |

---

## 12. Payments (Bảng thanh toán)
**Ý nghĩa**: Lưu trữ thông tin các giao dịch thanh toán

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| bookingId | ObjectId (ref Bookings) | Booking liên quan |
| amount | Number | Số tiền |
| currency | String | Đơn vị tiền tệ |
| method | String | "credit_card", "paypal", "stripe"... |
| paymentIntentId | String | ID từ payment gateway |
| status | String | "pending", "paid", "failed", "refunded" |
| paidAt | Date | Thời gian thanh toán |
| refundedAt | Date | Thời gian hoàn tiền |
| transactionId | String | Mã giao dịch |
| paymentDetails | Object | Chi tiết thanh toán (encrypted) |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

---

## 13. Reviews (Bảng đánh giá)
**Ý nghĩa**: Đánh giá của khách về chỗ ở và chủ nhà

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| listingId | ObjectId (ref Listings) | Căn nhà |
| bookingId | ObjectId (ref Bookings) | Booking liên quan |
| guestId | ObjectId (ref Users) | Khách đánh giá |
| guestName | String | Tên khách (denormalized) |
| guestProfileImageUrl | String | Ảnh đại diện khách (denormalized) |
| hostId | ObjectId (ref Users) | Chủ nhà |
| overallRating | Number | Điểm tổng thể (1-5) |
| cleanlinessRating | Number | Điểm vệ sinh |
| accuracyRating | Number | Điểm mô tả chính xác |
| checkinRating | Number | Điểm quá trình checkin |
| communicationRating | Number | Điểm giao tiếp |
| locationRating | Number | Điểm vị trí |
| valueRating | Number | Điểm giá trị |
| comment | String | Bình luận chi tiết |
| hostReply | String | Phản hồi của chủ nhà |
| hostRepliedAt | Date | Thời gian phản hồi |
| isPublic | Boolean | Hiển thị công khai |
| isReported | Boolean | Có bị báo cáo không |
| createdAt | Date | Ngày đánh giá |
| updatedAt | Date | Ngày cập nhật |

---

## 14. Wishlists (Bảng danh sách yêu thích)
**Ý nghĩa**: Danh sách các căn nhà khách muốn lưu lại

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| userId | ObjectId (ref Users) | Người tạo wishlist |
| name | String | Tên danh sách |
| description | String | Mô tả |
| privacy | String | "public", "private" |
| listings | [ObjectId] (ref Listings) | Danh sách căn nhà |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

---

## 15. Conversations (Bảng cuộc hội thoại)
**Ý nghĩa**: Quản lý các cuộc hội thoại giữa người dùng

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| participants | [ObjectId] (ref Users) | Mảng chứa ID của những người tham gia |
| listingId | ObjectId (ref Listings) | Listing liên quan đến cuộc hội thoại |
| lastMessage | String | Nội dung tin nhắn cuối cùng (để preview) |
| lastMessageAt | Date | Thời gian của tin nhắn cuối |
| unreadCounts | Object | Ví dụ: `{ "userId1": 2, "userId2": 0 }` |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

---

## 16. Messages (Bảng tin nhắn)
**Ý nghĩa**: Lưu trữ các tin nhắn trong một cuộc hội thoại

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| conversationId | ObjectId (ref Conversations) | ID cuộc hội thoại |
| senderId | ObjectId (ref Users) | Người gửi |
| content | String | Nội dung tin nhắn |
| messageType | String | "text", "image", "booking_request"... |
| readBy | [ObjectId] (ref Users) | Mảng các user đã đọc tin nhắn |
| createdAt | Date | Thời gian gửi |

---

## 17. Notifications (Bảng thông báo)
**Ý nghĩa**: Hệ thống thông báo cho người dùng

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| userId | ObjectId (ref Users) | Người nhận thông báo |
| type | String | "booking", "review", "payment"... |
| title | String | Tiêu đề thông báo |
| message | String | Nội dung |
| data | Object | Dữ liệu bổ sung (JSON) |
| isRead | Boolean | Đã đọc chưa |
| readAt | Date | Thời gian đọc |
| createdAt | Date | Thời gian tạo |
| updatedAt | Date | Thời gian cập nhật |

---

## 18. Coupons (Bảng mã giảm giá)
**Ý nghĩa**: Quản lý các mã khuyến mãi, giảm giá

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| code | String (unique) | Mã giảm giá |
| name | String | Tên chương trình |
| description | String | Mô tả |
| discountType | String | "percentage", "fixed" |
| discountValue | Number | Giá trị giảm |
| minOrderAmount | Number | Đơn hàng tối thiểu |
| maxDiscountAmount | Number | Giảm tối đa |
| usageLimit | Number | Số lần sử dụng tối đa |
| usedCount | Number | Đã sử dụng |
| userUsageLimit | Number | Giới hạn mỗi user |
| validFrom | Date | Hiệu lực từ |
| validTo | Date | Hiệu lực đến |
| applicableListings | [ObjectId] | Áp dụng cho listing nào |
| isActive | Boolean | Đang hoạt động |
| createdBy | ObjectId (ref Users) | Người tạo |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

---

## 19. CouponUsage (Bảng lịch sử sử dụng coupon)
**Ý nghĩa**: Theo dõi việc sử dụng mã giảm giá

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| couponId | ObjectId (ref Coupons) | Mã giảm giá |
| userId | ObjectId (ref Users) | Người sử dụng |
| bookingId | ObjectId (ref Bookings) | Booking áp dụng |
| discountAmount | Number | Số tiền được giảm |
| createdAt | Date | Thời gian sử dụng |

---

## 20. HostVerifications (Bảng xác thực chủ nhà)
**Ý nghĩa**: Quản lý quá trình xác thực chủ nhà

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| hostId | ObjectId (ref Users) | Chủ nhà |
| verificationType | String | "identity", "business", "phone"... |
| documentType | String | Loại giấy tờ |
| documentNumber | String | Số giấy tờ (mã hóa) |
| documentUrl | String | Link tài liệu tải lên |
| status | String | "pending", "approved", "rejected" |
| reviewedBy | ObjectId (ref Users) | Người duyệt |
| reviewedAt | Date | Thời gian duyệt |
| rejectionReason | String | Lý do từ chối |
| expiresAt | Date | Ngày hết hạn |
| createdAt | Date | Ngày nộp |
| updatedAt | Date | Ngày cập nhật |

---

## 21. Reports (Bảng báo cáo)
**Ý nghĩa**: Hệ thống báo cáo vi phạm, khiếu nại

| Trường | Kiểu | Giải thích |
|--------|------|------------|
| _id | ObjectId | Khóa chính |
| reporterId | ObjectId (ref Users) | Người báo cáo |
| reportedUserId | ObjectId (ref Users) | Người bị báo cáo |
| reportedListingId | ObjectId (ref Listings) | Listing bị báo cáo |
| reportedReviewId | ObjectId (ref Reviews) | Review bị báo cáo |
| type | String | "inappropriate_content", "fraud", "harassment"... |
| reason | String | Lý do cụ thể |
| description | String | Mô tả chi tiết |
| evidence | [String] | Bằng chứng (hình ảnh, link) |
| status | String | "pending", "investigating", "resolved", "dismissed" |
| assignedTo | ObjectId (ref Users) | Admin xử lý |
| resolution | String | Kết quả xử lý |
| resolvedAt | Date | Thời gian giải quyết |
| createdAt | Date | Thời gian báo cáo |
| updatedAt | Date | Thời gian cập nhật |

---

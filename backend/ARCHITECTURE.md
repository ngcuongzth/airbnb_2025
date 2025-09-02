# Kiến trúc Backend - Airbnb Clone

Tài liệu này mô tả kiến trúc tổng thể cho hệ thống backend của dự án Airbnb Clone, bao gồm Mô hình Thực thể Quan hệ (ERD) và Phân cấp Chức năng.

## 1. Mô hình Thực thể Quan hệ (ERD)

Mô hình ERD được xây dựng dựa trên phân tích chi tiết trong `airbnb_erd.md`. Dưới đây là tóm tắt các thực thể cốt lõi và mối quan hệ chính giữa chúng.

### Các Thực thể (Entities) Cốt lõi:

*   **Users**: Quản lý tất cả người dùng (guest, host, admin).
*   **Listings**: Đại diện cho một chỗ ở cho thuê. Đây là thực thể trung tâm.
*   **Bookings**: Giao dịch đặt phòng của một `User` cho một `Listing`.
*   **Reviews**: Đánh giá của `User` (guest) về một `Listing` sau khi hoàn thành `Booking`.
*   **Payments**: Ghi lại các giao dịch thanh toán cho một `Booking`.
*   **Conversations / Messages**: Hệ thống nhắn tin giữa các `User`.

### Sơ đồ Mối quan hệ Chính:

```
[User (Host)] 1--to--N [Listings]

[User (Guest)] 1--to--N [Bookings]
[User (Guest)] 1--to--N [Reviews]
[User (Guest)] 1--to--N [Wishlists]

[Listings] 1--to--N [Bookings]
[Listings] 1--to--N [Reviews]
[Listings] 1--to--N [ListingImages]
[Listings] 1--to--N [Availability]

[Bookings] 1--to--1 [Reviews] (Một booking chỉ có một review)
[Bookings] 1--to--N [Payments] (Có thể có thanh toán và hoàn tiền)

[Users] N--to--M [Conversations] (Thông qua bảng `participants`)
```

### Đề xuất & Tinh chỉnh:

1.  **Quan hệ Listings và Amenities (N-M):**
    *   Trong `airbnb_erd.md`, `Listings` có trường `amenities: [ObjectId]`. Đây là cách tiếp cận tốt, nhúng trực tiếp mảng ID tiện ích.
    *   Tuy nhiên, trong `search_filter_module.md`, pipeline query lại `$lookup` từ một collection tên là `listingamenities`.
    *   **Khuyến nghị:** Nên thống nhất một cách tiếp cận. Việc tạo một collection riêng `ListingAmenities` (bảng nối) như trong `search_filter_module.md` sẽ mang lại sự linh hoạt cao hơn trong tương lai và tối ưu cho các truy vấn tìm kiếm phức tạp.

2.  **Bảng `Availability`:**
    *   Thiết kế lưu `isAvailable` theo từng ngày là rất chi tiết và mạnh mẽ, cho phép kiểm soát giá và tình trạng phòng linh hoạt.
    *   **Lưu ý:** Cách tiếp cận này có thể tạo ra một lượng lớn bản ghi. Cần có chiến lược dọn dẹp (cron job) cho các ngày trong quá khứ để đảm bảo hiệu năng. Đây là một sự đánh đổi hợp lý.

---

## 2. Mô hình Phân cấp Chức năng

Dựa trên `airbnb_functions_apis.md`, chúng ta có thể cấu trúc các chức năng thành các module lớn, giúp việc phân chia công việc và quản lý code dễ dàng hơn.

### I. Module Nền tảng & Cốt lõi (Platform & Core)
*   **1. Quản lý Xác thực (Authentication)**
    *   Đăng ký, Đăng nhập, Đăng xuất
    *   Quên/Reset mật khẩu
    *   Làm mới Token (Refresh Token)
    *   Xác thực qua Social (Google, Facebook - *mở rộng*)
*   **2. Quản lý Thanh toán (Payment Integration)**
    *   Tích hợp Stripe/PayPal
    *   Tạo Payment Intent
    *   Xử lý Webhook
*   **3. Hệ thống Thông báo (Notifications)**
    *   Gửi thông báo (In-app, Email, Push)
    *   Quản lý trạng thái thông báo (đã đọc/chưa đọc)
*   **4. Dữ liệu chung (Common Data)**
    *   Quản lý Quốc gia, Thành phố
    *   Quản lý Loại tài sản, Tiện ích, Chính sách hủy

### II. Module cho Khách thuê (Guest-Facing)
*   **1. Tìm kiếm & Khám phá (Search & Discovery)**
    *   Tìm kiếm theo địa điểm, ngày, số lượng khách
    *   Bộ lọc nâng cao (giá, tiện ích, loại nhà...)
    *   Tìm kiếm trên bản đồ
    *   Gợi ý tìm kiếm
*   **2. Quản lý Đặt phòng (Booking)**
    *   Tạo/Hủy đặt phòng
    *   Xem chi tiết & lịch sử đặt phòng
*   **3. Quản lý Đánh giá (Reviews)**
    *   Viết/Sửa/Xóa đánh giá
    *   Xem đánh giá của một listing
*   **4. Danh sách Yêu thích (Wishlists)**
    *   Tạo/Xóa Wishlist
    *   Thêm/Bỏ listing khỏi Wishlist
*   **5. Nhắn tin (Messaging)**
    *   Chat với chủ nhà

### III. Module cho Chủ nhà (Host-Facing)
*   **1. Quản lý Chỗ ở (Listing Management)**
    *   Tạo/Sửa/Xóa listing
    *   Quản lý hình ảnh, tiện ích
    *   Thiết lập giá, lịch trống
*   **2. Quản lý Đặt phòng của Host (Host's Booking Management)**
    *   Xác nhận/Từ chối booking
    *   Xem lịch sử các booking nhận được
*   **3. Bảng điều khiển của Host (Host Dashboard)**
    *   Thống kê thu nhập, lượt đặt phòng

### IV. Module Quản trị viên (Admin-Facing)
*   **1. Bảng điều khiển Admin (Admin Dashboard)**
    *   Thống kê toàn hệ thống (doanh thu, người dùng, listings)
*   **2. Quản lý Người dùng (User Management)**
    *   Xem danh sách, chi tiết người dùng
    *   Vô hiệu hóa/Kích hoạt tài khoản
*   **3. Quản lý Nội dung (Content Management)**
    *   Duyệt/Gỡ bỏ listings
    *   Quản lý báo cáo, khiếu nại
*   **4. Quản lý Mã giảm giá (Coupon Management)**
    *   Tạo/Sửa/Xóa coupons

---

## 3. Luồng hoạt động ví dụ: Tạo một Đặt phòng (Create Booking)

Luồng này minh họa cách các module và thực thể tương tác với nhau.

1.  **Người dùng (Guest)**: Chọn ngày check-in, check-out, số lượng khách trên trang chi tiết listing và nhấn "Reserve".

2.  **Frontend**: Gửi yêu cầu `POST /api/bookings` với các thông tin: `listingId`, `checkIn`, `checkOut`, `guests`.

3.  **Backend - Middleware**:
    *   `requireAuth`: Kiểm tra xem người dùng đã đăng nhập chưa.
    *   `validateBookingRequest`: Kiểm tra tính hợp lệ của dữ liệu đầu vào (ví dụ: `checkOut` phải sau `checkIn`).

4.  **Backend - Booking Controller**:
    *   **Đọc dữ liệu**:
        *   Truy vấn collection `Listings` để lấy thông tin về giá, phí dọn dẹp, số khách tối đa, `hostId`.
        *   Truy vấn collection `Availability` để kiểm tra xem tất cả các đêm trong khoảng thời gian yêu cầu có `isAvailable = true` hay không. Nếu không, trả về lỗi.
    *   **Tính toán**:
        *   Tính `baseAmount`, `serviceFee`, `totalAmount`.
    *   **Tạo bản ghi**:
        *   Tạo một bản ghi mới trong collection `Bookings` với `status: 'pending'`.
    *   **Tích hợp thanh toán (Payment Module)**:
        *   Gọi đến dịch vụ thanh toán (ví dụ: Stripe) để tạo một `paymentIntent` với `totalAmount`.
    *   **Tạo thông báo (Notification Module)**:
        *   Tạo một thông báo mới trong collection `Notifications` cho `hostId` về yêu cầu đặt phòng mới.

5.  **Backend - Response**:
    *   Trả về cho frontend thông tin về booking vừa tạo và `client_secret` của `paymentIntent` để frontend có thể tiến hành thanh toán.

6.  **Frontend**:
    *   Nhận response và hiển thị giao diện thanh toán (ví dụ: Stripe Card Element) để người dùng nhập thông tin thẻ.
    *   Sau khi người dùng xác nhận, frontend sẽ hoàn tất thanh toán với Stripe.

7.  **Backend - Webhook**:
    *   Stripe gửi một sự kiện `payment_intent.succeeded` đến webhook của backend.
    *   Webhook handler xác thực và cập nhật `Bookings.status` thành `'confirmed'` và `Bookings.paymentStatus` thành `'paid'`.
    *   Cập nhật collection `Availability`, set `isAvailable = false` cho các ngày đã được đặt.
    *   Gửi thông báo xác nhận cho cả Guest và Host.

---


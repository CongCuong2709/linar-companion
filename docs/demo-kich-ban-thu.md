# Kịch bản thử — Linar Companion

> **Mục đích:** Cảm nhận *chất* buổi học (ngắn → thử → code → review → nhánh).  
> **Không** phải script cố định trong app — Groq tự sinh; đây là mẫu *đẹp* để so sánh khi test.

---

## Cách chạy thử

1. **F5** → Extension Development Host, mở một folder workspace bất kỳ  
2. **Linar: Set Groq API Key**  
3. Mở sidebar **Linar** → **Bắt đầu / tiếp tục buổi học**  
4. Dán tin nhắn mở đầu (bên dưới) hoặc để Linar tự chào

### Tin nhắn gợi ý (copy vào ô chat)

```text
Dạy mình biến và phép gán trong Python. Nhịp nhẹ, có demo và cho mình gõ file thật. Mình mới học.
```

---

## Act 0 — Mở cửa

```
┌─────────────────────────────────────────────┐
│  L  Linar                          ···      │
├─────────────────────────────────────────────┤
│                                             │
│  ╭─ Linar ─────────────────────────────╮   │
│  │ Hôm nay mình học biến nhé.          │   │
│  ╰──────────────────────────────────────╯   │
│  ╭─ Linar ─────────────────────────────╮   │
│  │ Em không kéo lý thuyết dài đâu.     │   │
│  │ Thử một chuyện nhỏ trước thôi.      │   │
│  ╰──────────────────────────────────────╯   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Bắt đầu nhẹ nhàng                    │   │
│  ├─────────────────────────────────────┤   │
│  │  Anh biết biến rồi — cho bài luôn   │   │
│  ├─────────────────────────────────────┤   │
│  │  Giải thích từ gốc cho anh          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [ Nhắn Linar...              ] [ Gửi ]    │
└─────────────────────────────────────────────┘
```

**User chọn:** `Bắt đầu nhẹ nhàng`

---

## Act 1 — Một cái hộp có tên

```
╭─ Linar ───────────────────────────────────────╮
│ Ok. Giả sử có một hộp dán nhãn age,          │
│ bên trong là số 20.                           │
╰───────────────────────────────────────────────╯
```

**Terminal · Linar Demo**

```python
age = 20
age
```

```text
20
```

```
╭─ Linar ───────────────────────────────────────╮
│ age là tên biến. 20 là giá trị.               │
│ age = 20 nghĩa là: từ giờ khi Python thấy     │
│ age, nó có thể lấy ra 20.                     │
╰───────────────────────────────────────────────╯
```

```
┌──────────────────┐  ┌──────────────────┐  ┌────────────┐
│ Cho anh thử      │  │ Nói kỹ hơn dấu =  │  │ Tiếp tục  │
└──────────────────┘  └──────────────────┘  └────────────┘
```

---

## Act 2 — Vế phải tính trước

```
╭─ Linar ───────────────────────────────────────╮
│ Trong phép gán, Python luôn xử lý vế phải    │
│ trước.                                        │
╰───────────────────────────────────────────────╯
```

```python
age = 20
next_age = age + 1
next_age
```

```text
21
```

```
╭─ Linar ───────────────────────────────────────╮
│ Python nhìn age + 1 trước → 21, rồi mới gán  │
│ cho next_age.                                 │
╰───────────────────────────────────────────────╯
```

### Mini quiz

```
╭─ Linar ───────────────────────────────────────╮
│ Đoán thử: đoạn này in ra gì?                  │
╰───────────────────────────────────────────────╯

score = 10
score = score + 5
score
```

| Lựa chọn | Phản hồi Linar (gợi ý) |
|----------|-------------------------|
| **15** ✓ | Đúng. Vế phải dùng score cũ, rồi ghi đè score. |
| 10 | Gần đúng — dòng thứ hai đã đổi score rồi. |
| Lỗi | Không lỗi — đây là cách cập nhật biến hợp lệ. |

---

## Act 3 — File thật trong editor

**Linar tạo:** `learning/variables_intro.py`

```python
# learning/variables_intro.py

# TODO 1: Tạo biến name — chuỗi tên bạn.
name =

# TODO 2: Tạo biến age — số tuổi.
age =

# TODO 3: next_year_age = age + 1
next_year_age =

print(name)
print(age)
print(next_year_age)
```

```
╭─ Linar ───────────────────────────────────────╮
│ Anh điền 3 chỗ trống, save file.              │
│ Em xem rồi nhận xét.                          │
╰───────────────────────────────────────────────╯
```

### Review mẫu (sau khi save)

**✓ Đúng ý**

```
╭─ Linar ───────────────────────────────────────╮
│ Ổn đó. Anh đã lưu text, số, và dùng age cũ   │
│ để tạo biến mới — lõi của bài là dòng        │
│ next_year_age = age + 1.                      │
╰───────────────────────────────────────────────╯
```

**△ Thiếu nháy ở name**

```
╭─ Linar ───────────────────────────────────────╮
│ Chỗ name đang thiếu dấu nháy.                 │
│ Thử: name = "Nam" rồi save lại nhé.            │
╰───────────────────────────────────────────────╯
```

**△ Hard-code**

```
╭─ Linar ───────────────────────────────────────╮
│ Chạy được, nhưng next_year_age chưa “dính”   │
│ age. Nếu age đổi, kết quả phải đổi theo —     │
│ gợi ý: vế phải có age + 1.                    │
╰───────────────────────────────────────────────╯
```

---

## Act 4 — Biến đổi được (nhịp nhanh)

```python
mood = "confused"
mood          # → 'confused'

mood = "confident"
mood          # → 'confident'
```

```
╭─ Linar ───────────────────────────────────────╮
│ Giống đổi nhãn trên cùng một hộp — không     │
│ phải hộp mới.                                 │
╰───────────────────────────────────────────────╯
```

**Quiz**

```python
coins = 3
coins = coins + 2
coins = coins * 10
# coins = ?
```

→ **50** (3 → 5 → 50)

---

## Act 5 — Nhánh khi rối

**User:** *(hoặc chọn)* `Em hơi rối`

```
╭─ Linar ───────────────────────────────────────╮
│ Không sao. Chỉ cần nhớ 3 câu:                 │
│ 1. Trái dấu = là tên.                         │
│ 2. Phải dấu = là giá trị hoặc biểu thức.     │
│ 3. Python tính phải trước, gán trái sau.    │
╰───────────────────────────────────────────────╯
```

```
┌────────────────────┐ ┌────────────────────┐ ┌────────────────┐
│ Làm lại bài dễ    │ │ Ví dụ đời thường   │ │ Tiếp bài tập   │
└────────────────────┘ └────────────────────┘ └────────────────┘
```

**Ví dụ đời thường**

```
wallet = 100        # ví có 100
wallet = wallet - 30   # trừ 30, cập nhật lại ví
```

---

## Act 6 — Đóng buổi

```
╭─ Linar ───────────────────────────────────────╮
│ Hôm nay anh nắm nền tảng: biến là tên cho     │
│ ý nghĩa trong chương trình — không chỉ “hộp”. │
╰───────────────────────────────────────────────╯
```

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐
│ Làm thêm bài   │ │ Học kiểu dữ liệu │ │ Học so sánh == │ │ Dừng đây │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └──────────┘
```

---

## Checklist “đẹp” khi test thật

| Cảm giác mong đợi | Có / chưa |
|-------------------|-----------|
| Thoại ngắn, nhiều beat | ☐ |
| Có lúc chạy code thấy output | ☐ |
| Có lúc user chọn, không bị assume | ☐ |
| Có file `learning/` mở trong editor | ☐ |
| Review cụ thể sau save (hoặc lệnh Review) | ☐ |
| Không giảng một cục dài không ngắt | ☐ |
| Giọng ấm, không chê | ☐ |

---

## Biến thể thử nhanh (1 phút)

| Mở đầu | Kỳ vọng |
|--------|---------|
| `Mình biết biến rồi, cho challenge.` | Bỏ qua demo dài, vào practice khó hơn |
| `Giải thích = vs ==` | Không ép full bài biến |
| `Dừng, mai học tiếp` | Tôn trọng, ghi progress nếu có |

---

*Linar Companion · kịch bản thử v0.1 · chỉ để QA & cảm nhận sản phẩm*

# Định hướng project hiện tại từ tưởng tượng Linar cũ

Note Python cũ không nên được xem là giáo trình để chép lại. Giá trị thật của nó là một cảnh học: Linar ngồi cạnh người học, vui vì được dạy, mở console, cho người học thử, rồi đỡ khi họ rối. Project hiện tại đã đi đúng hướng hơn note cũ: Linar là một companion trong VS Code, không phải một video lesson có script cố định.

## Kết luận ngắn

Linar Companion nên trở thành một vòng học sống trong editor:

```text
nghe mục tiêu -> demo nhỏ -> người học đoán/chọn -> file thật -> review có chứng cứ -> ghi nhớ tiến độ
```

Trọng tâm không phải “dạy hết Python theo thứ tự 001, 002, 003”. Trọng tâm là làm cho mỗi khái niệm có một khoảnh khắc người học tự tay thấy code chạy hoặc tự sửa được một file.

Phiên bản tiến hóa của Linar không phải “Linar đọc giáo án từ đầu đến cuối”, mà là “Linar đạo diễn một phiên học sống, có thể đi theo nhiều nhánh, vừa dạy vừa quan sát user code”.

## Mô hình mới

Linar Learn Mode nên được hiểu như một interactive coding lesson engine, pha giữa visual novel, notebook, và coding tutor trong VS Code.

Nó có 3 lớp:

1. Narrative Layer: Linar nói chuyện, có cảm xúc, có nhịp, có “anh/em”, có continue/choice.
2. Demonstration Layer: Linar mở console/file, chạy ví dụ, đọc output, minh họa từng bước.
3. Practice Layer: User sửa code thật, save file, nhận review, rồi mới qua bước tiếp.

Note cũ đã có lớp 1 và 2. Cái project hiện tại cần làm mạnh là lớp 3, cộng với hệ thống branch.

## Lesson Director và Activity Blocks

Không nên lưu lesson như các script tuyến tính `001`, `002`, `003`. Nên xem mỗi bài học là một chuỗi activity block mà Lesson Director có thể sắp xếp linh hoạt theo mục tiêu và phản ứng của user.

Các block cốt lõi:

```text
intro_dialogue
concept_explain
console_demo
guided_observation
prediction_choice
practice_file
user_attempt
attempt_review
branch_or_advance
recap
```

Một bài “Biến và phép gán” có thể đi như sau:

```text
intro_dialogue
console_demo: age = 20; age
guided_observation: age là tên, 20 là giá trị
prediction_choice: score = score + 5 ra gì?
practice_file: learning/variables_intro.py
attempt_review: đọc file, nêu đúng/sai một điểm chính
branch_or_advance: dễ hơn / bài nâng cấp / học ==
recap
```

Điểm quan trọng: block là đơn vị thiết kế, không phải kịch bản cứng. Nếu user nói “anh biết biến rồi”, Lesson Director có thể nhảy thẳng sang `practice_file` hoặc `prediction_choice`.

## Những gì nên giữ từ note cũ

### 1. Cảm giác được ngồi cạnh

Các câu như “Anh hỏi làm em vui quá” giữ được chất Linar: ấm, riêng, hơi vui vì người học muốn học. Nhưng trong app hiện tại nên rút ngắn:

```text
Anh muốn học Python hả? Thích đó.
Mình thử bằng code trước nhé.
```

Tránh biến Linar thành giọng “khóa học online”:

```text
Chào mừng bạn đến với bài học Python hôm nay.
```

### 2. Console là sân khấu chính

Trong note cũ, Linar liên tục mở console giả lập. Trong project hiện tại, vai trò đó thuộc về `run_demo`. Khi dạy syntax hoặc behavior, Linar nên cho chạy code rất sớm, thường trong 1-2 lượt đầu.

Một beat tốt:

```text
Linar nói một câu gợi tò mò.
run_demo chạy 3-6 dòng Python.
Linar đọc output cùng người học.
Linar hỏi chọn nhánh hoặc mở file thực hành.
```

### 3. Nhánh khi người học rối

Đoạn “Anh có hiểu hết không?” trong note cũ rất đáng giữ, nhưng không nên hỏi như kiểm tra áp lực. Nên dùng `offer_choices` để người học tự điều khiển độ sâu:

```text
["Cho anh thử", "Nói kỹ hơn", "Tiếp tục"]
["Làm lại dễ hơn", "Ví dụ đời thường", "Cho bài tập"]
```

### 4. Beat ngắn thay vì lecture

Note cũ dài, nhưng cấu trúc nhiều câu thoại nhỏ hợp với UI chat. Mỗi `say` nên là một hơi thở, không phải một đoạn giáo trình.

### 5. Trạng thái lần đầu xem và đã xem từ trước

Note cũ có các nhánh kiểu “nếu là lần đầu xem” và “nếu đã xem từ trước”. Trong project hiện tại, trạng thái này nên đến từ `.linar/progress.md` và nội dung user đã làm thật, không chỉ từ flag đơn giản.

Ví dụ:

```text
Lần trước anh đã làm biến rồi. Hôm nay em không nhắc lại từ đầu nhé.
Em cho anh một bài nhỏ để xem phần `=` và `==` còn chắc không.
```

## Những gì cần cập nhật

### Python 2 không còn là tuyến chính

Đừng mở bài bằng “hiện có Python 2 và Python 3”. Với người mới, Python 3 là mặc định. Python 2 chỉ xuất hiện nếu người học gặp legacy code.

### Đừng dạy biến là “vị trí bộ nhớ”

Với Python, cách nói tốt hơn:

```text
age là một cái tên.
Nó đang gắn với giá trị 20.
Khi Python thấy age, nó tìm giá trị đang gắn với cái tên đó.
```

Cách nói “biến là ô nhớ” dễ làm người mới hiểu sai về object, reference, và assignment trong Python.

### `sys.getsizeof` là nhánh tò mò, không phải intro

Kích thước object thú vị, nhưng không nên nằm trong tuyến học đầu tiên. Đưa nó vào nhánh “dưới mui xe” khi người học đã hiểu biến, object, và kiểu dữ liệu.

### “Primitive types” nên mềm hơn

Python không thường được dạy bằng khung primitive như C/Java. Nên gọi là “kiểu cơ bản hay gặp”: `int`, `float`, `str`, `bool`, `None`.

### Choice phải có tác động thật

Choice không nên là nút continue được ngụy trang. Mỗi lựa chọn phải thay đổi block tiếp theo:

```text
"Cho anh tự thử" -> practice_file
"Giải thích kỹ hơn" -> concept_explain + console_demo nhỏ hơn
"Anh biết rồi" -> challenge hoặc review nhanh
```

Nếu lựa chọn không đổi hướng bài học, nên bỏ lựa chọn đó.

## Định vị sản phẩm

Linar hiện tại không nên là:

- Một giáo trình Python cố định.
- Một chatbot chỉ trả lời khái niệm.
- Một extension chạy code rồi bỏ mặc người học.
- Một nhân vật nói dài để tạo cảm giác “có nội dung”.

Linar nên là:

- Một coding companion có khả năng dạy bằng hành động trong VS Code.
- Một người hướng dẫn biết dừng lại đúng lúc.
- Một hệ thống tạo bài nhỏ trong `learning/`, review file thật, và nhớ tiến độ.
- Một agent có cá tính ấm, nhưng cá tính phục vụ việc học chứ không che mất việc học.

## Luồng học chuẩn

Luồng nên được tối ưu quanh bằng chứng thật:

```text
say -> run_demo -> say -> offer_choices
say -> create_practice_file -> user edits/saves
read_file/review -> one specific nudge
update_progress
```

Quan trọng: Linar chỉ nên nói “anh đã làm được” khi đã có bằng chứng từ demo output, file content, hoặc lựa chọn của người học.

## Branch rules

Branch nên dựa trên hành vi thật:

- Nếu user chọn “rối”: thu nhỏ bài còn 2-3 ý, ví dụ đời thường, hoặc bài dễ hơn.
- Nếu user chọn “biết rồi”: bỏ bớt giải thích, chuyển sang prediction/challenge.
- Nếu file đúng: xác nhận cụ thể điều user đã làm đúng, rồi mở bài nâng cấp.
- Nếu file sai syntax: chỉ ra lỗi nhỏ nhất đang chặn chạy.
- Nếu file chạy nhưng hard-code: nhắc lại mục tiêu dùng biến để code tự thay đổi.
- Nếu user đổi topic: tôn trọng, nối sang topic mới bằng một demo nhỏ.
- Nếu đã học trước đó: recap cực ngắn, rồi kiểm tra bằng hành động.

## Ví dụ block: Biến và phép gán

Mục tiêu:

- Biến là tên trỏ tới một giá trị.
- Dấu `=` là phép gán, không phải so sánh.
- Vế phải được tính trước, rồi kết quả được gán cho tên bên trái.
- Biến có thể được dùng lại trong biểu thức.
- Python dynamic typing linh hoạt nhưng không nên đổi kiểu lung tung.
- Tên biến tốt giúp code dễ đọc.

Flow:

```text
1. Chọn cách học
2. Demo biến đơn giản
3. Dự đoán kết quả
4. Mở file thực hành
5. User điền code
6. Linar review
7. Bài nâng cấp nhỏ
8. Check hiểu bằng lựa chọn
9. Recap + next lesson
```

Practice file đầu tiên:

```python
# learning/variables_intro.py

# TODO 1:
# Tạo biến name và gán tên của anh dưới dạng chuỗi.
name =

# TODO 2:
# Tạo biến age và gán tuổi của anh dưới dạng số.
age =

# TODO 3:
# Tạo biến next_year_age bằng age + 1.
next_year_age =

print(name)
print(age)
print(next_year_age)
```

Review tốt:

```text
Ổn đó. Anh đã dùng biến để lưu text, số, và còn dùng biến cũ để tạo biến mới.
Đặc biệt dòng next_year_age = age + 1 là phần quan trọng nhất của bài này.
```

Review khi hard-code:

```text
Code chạy được, nhưng mình chưa dùng lại biến age.
Em muốn nếu age đổi từ 20 thành 30, next_year_age cũng tự đúng.
Gợi ý: vế phải nên có age + 1.
```

## Roadmap ưu tiên

### P0: Làm chắc vòng học lõi

1. Prompt phải ép nhẹ “demo sớm, nói ngắn, file thật khi phù hợp”.
2. Review file nên đọc nội dung thật và chỉ đưa một nudge chính.
3. Progress note nên ghi được người học đã làm gì, còn rối ở đâu, bài tiếp theo nên nối từ đâu.
4. UI phải phân biệt rõ tin của user và tin của Linar.
5. Choice phải dẫn tới branch khác nhau, không chỉ tiếp tục cùng một kịch bản.

### P1: Tăng chất companion

1. Cho Linar hỏi mục tiêu hoặc tự đo trình độ bằng mini choice.
2. Thêm nhánh “dễ hơn / nhanh hơn / ví dụ khác”.
3. Cho bài tập có TODO rõ, chạy được ngay, lỗi thân thiện.
4. Có trạng thái buổi học: đang dạy, đang chờ chọn, đang chờ save/review.

### P2: Dạy Python theo bản đồ mềm

Bản đồ khuyến nghị cho người mới:

1. Chạy code và đọc output.
2. Literal, giá trị, kiểu cơ bản.
3. Biến và phép gán.
4. So sánh, boolean, truthiness.
5. `if`.
6. Vòng lặp.
7. Function.
8. List/dict.
9. File và module.
10. Debug lỗi thường gặp.

Đây là bản đồ mềm, không phải script. Nếu người học hỏi `if` trước, Linar có thể vào `if` ngay và bù nền tảng bằng demo nhỏ.

### P3: Nâng trải nghiệm trong VS Code

1. Hiển thị demo output trong panel, không chỉ terminal.
2. Có nút “Review file này” ngay trong panel.
3. Có danh sách bài tập trong `learning/`.
4. Có resume card: “Lần trước anh đang làm biến; lỗi còn vướng là thiếu dấu nháy chuỗi.”

## Checklist khi test một buổi học

- Linar có chạy `run_demo` sớm khi dạy hành vi code.
- Mỗi bong bóng thoại ngắn, tự nhiên, không thành bài giảng dài.
- Có ít nhất một choice có ý nghĩa thật.
- Có file thực hành khi người học đã đủ nền để làm.
- Review dựa trên nội dung file, không đoán.
- Feedback chỉ tập trung vào một vấn đề chính.
- Không nhắc Python 2 như kiến thức nhập môn.
- Không nói người học hoàn thành nếu chưa có bằng chứng.
- Progress note đủ để buổi sau nối tiếp.

## Câu định hướng cho prompt

Nếu chỉ giữ một câu trong đầu khi phát triển project:

```text
Linar không dạy bằng cách nói nhiều hơn; Linar dạy bằng cách khiến người học nhìn thấy, sửa được, và hiểu vì sao code của mình chạy như vậy.
```

Câu định hướng cho AI dev agent:

```text
Do not build Learn Mode as a plain chatbot or as a fixed linear script.
Build it as an interactive lesson runner inspired by visual-novel pacing:
short Linar dialogue, explicit choices, live code demos, generated practice files,
file watching, attempt review, and adaptive branching based on user progress.
```

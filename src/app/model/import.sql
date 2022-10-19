INSERT INTO status(status_id, status_name) VALUES (1, 'Create');
INSERT INTO status(status_id, status_name) VALUES (2, 'Publish');
INSERT INTO status(status_id, status_name) VALUES (3, 'Checkout');
INSERT INTO status(status_id, status_name) VALUES (4, 'Finished');

INSERT INTO service(service_id, method_name, detail) VALUES (1, 'getStudent', '1. ค้นหาข้อมูลโดยเรียก SQLselect student_id,CONCAT(first_name,' ',last_name) as full_name, birthdate,b.blood_id,b.blood_name,tel,email from student s left join blood b on s.blood_id = b.blood_idorder by student_id2. Set ค่าที่ค้นหาได้ ใส่ List<StudentDto>3. Return List<StudentDto>');
INSERT INTO service(service_id, method_name, detail) VALUES (2, 'getCourse', '1. ค้นหาข้อมูลโดยเรียก SQLselect course_id,CONCAT(course_code,"-",course_name) course_name,price,credit FROM coursewhere active = "y" order by course_id 2. Set ค่าที่ค้นหาได้ ใส่ List<CourseDto> 3. Return List<StudentDto>');
INSERT INTO service(service_id, method_name, input_parameter, example_response, example_picture, detail) VALUES (3, 'queryRegistrationById', 'Long regisId','{"regisId": 1,"student": {"studentId": 1,"fullName": "xxxx xxx","birthDate": null,"blood": null,"tel": null,"email": null},"regisDate": 1587661200000,"course": {"courseId": 4,"courseName": "05506207 - CALCULUS 1","credit": 3,"price": 285},"status": "Y"}' ,'ex_pic.png','1. รับค่า regisId2. ค้นหาข้อมูลโดยเรียก SQLselect regis_id,regis_date,s.student_id,CONCAT(first_name,' ',last_name) as full_name,c.course_id,CONCAT(course_code," - ",course_name) course_name,credit,price,status from registrations releft join course c on re.course_id = c.course_idleft join student s on re.student_id = s.student_idwhere regis_id = ?3. Set ค่าที่ค้นหาได้ใส่ RegistrationDto4. Return RegistrationDto');
INSERT INTO service(service_id, method_name, input_parameter, detail) VALUES (4, 'createRegis', '{"regisDate": "2020-04-25T17:00:00.000Z","status": "Y","student": {"studentId": 1 },"course": {"courseId": 13 }}','1. รับค่า RegistrationDto2. บันทึกข้อมูลโดยเรียก SQLinsert into registrations (student_id,regis_date,course_id,status) values(?,?,?,?)');
INSERT INTO service(service_id, method_name, input_parameter, detail) VALUES (5, 'updateRegis', '{"regisId": 5,"regisDate": "2020-04-25T17:00:00.000Z","status": "Y","student": {"studentId": 1 },"course": {"courseId": 13 }}','1. รับค่า RegistrationDto2. แก้ไขข้อมูลโดยเรียก SQLupdate registrations set student_id = ? ,regis_date = ? ,course_id = ? ,status = ? where regis_id = ?');
INSERT INTO service(service_id, method_name, input_parameter, example_response, detail) VALUES (6, 'queryRegisByCondition', 'String firstName, String lastName, String email, Long courseId, String status', '[{"regisId": 1,"student": {"studentId": 1,"fullName": "xx xxxxx","birthDate": null,"blood": null,"tel": "0123456789","email": "arsom@gmail.com"},"regisDate": 1587661200000,"course": {"courseId": 4,"courseName": "05506207 - CALCULUS 1","credit": null,"price": null},"status": "Y"}]', '1. รับค่า fistName, lastName, email, courseId, status2. ค้นหาข้อมูลโดยเรียก SQLselect regis_id,regis_date,s.student_id,CONCAT(first_name,' ',last_name) asfull_name,c.course_id,CONCAT(course_code," - ",course_name) course_name,email,tel,status fromregistrations releft join course c on re.course_id = c.course_idleft join student s on re.student_id = s.student_id where 1=1 3. กําหนดเงือนไข- ตรวจสอบค่าของ firstName ต้องไม่เท่ากับ null และค่าว่างand first_name like ?- ตรวจสอบค่าของ lastName ต้องไม่เท่ากับ null และค่าว่างand last_name like ?3.3. ตรวจสอบค่าของ email ต้องไม่เท่ากับ null และค่าว่างand email like ?- ตรวจสอบค่าของ courseId ต้องไม่เท่ากับ nulland c.course_id = ?- ตรวจสอบค่าของ status ต้องไม่เท่ากับ null และค่าว่างand status = ?4. Set ค่าที่ได้จากการค้นหาใส่ List<RegistrationDto>5. Return ค่า List< RegistrationDto>');
INSERT INTO service(service_id, method_name, input_parameter, detail) VALUES (7, 'deleteRegis', 'Long regisId', '1. รับค่า regisId2. ลบข้อมูลโดยเรียก SQLDelete from registrations where regis_id = ?');
INSERT INTO service(service_id, method_name, input_parameter, detail) VALUES (8, 'testService', 'testServiceId', '1. ค้นหาข้อมูลโดยเรียก SQLselect testservice_id,CONCAT(testservice_code,"-",testservice_name) testservice_name,price,credit FROM testservicewhere active = "y" order by testservice_id 2. Set ค่าที่ค้นหาได้ ใส่ List<testserviceDto> 3. Return List<testserviceDto>');

INSERT INTO systemanalyst(systemanalyst_id, systemanalyst_name) VALUES (1, 'Alyssa');
INSERT INTO systemanalyst(systemanalyst_id, systemanalyst_name) VALUES (2, 'Chet');
INSERT INTO systemanalyst(systemanalyst_id, systemanalyst_name) VALUES (3, 'Marine');
INSERT INTO systemanalyst(systemanalyst_id, systemanalyst_name) VALUES (4, 'Marisa');

INSERT INTO project(project_id, project_name) VALUES (1, 'โครงการพัฒนาระบบ WorkshopSpec');
INSERT INTO project(project_id, project_name) VALUES (2, 'โครงการพัฒนาระบบ PG-Pool');
INSERT INTO project(project_id, project_name) VALUES (3, 'โครงการพัฒนาระบบ แบบข้อสอบ online');
INSERT INTO project(project_id, project_name) VALUES (4, 'โครงการพัฒนาระบบ Program Spec editor');

INSERT INTO system(system_id, system_name) VALUES (1, 'ระบบ WorkshopSpec');
INSERT INTO system(system_id, system_name) VALUES (2, 'ระบบ PG-Pool');
INSERT INTO system(system_id, system_name) VALUES (3, 'ระบบ แบบข้อสอบ online');
INSERT INTO system(system_id, system_name) VALUES (4, 'ระบบ Program Spec editor');

INSERT INTO programs(program_id, program_name, project_id, system_id, systemanalyst_id, status_id) VALUES (1, 'WorkshopSpec', 1, 1, 1, 1);
INSERT INTO programs(program_id, program_name, project_id, system_id, systemanalyst_id, status_id) VALUES (2, 'PG-Pool', 2, 2, 2, 2);
INSERT INTO programs(program_id, program_name, project_id, system_id, systemanalyst_id, status_id) VALUES (3, 'แบบข้อสอบ-online', 3, 3, 3, 3);
INSERT INTO programs(program_id, program_name, project_id, system_id, systemanalyst_id, status_id) VALUES (4, 'Program Spec editor', 4, 4, 4, 4);

INSERT INTO pageimages(pageimage_id, pageimage_name, picture, program_id) VALUES (1, 'หน้าจอค้นหาข้อมูล', 'Regis.png', 1);
INSERT INTO pageimages(pageimage_id, pageimage_name, picture, program_id) VALUES (2, 'ตารางแสดงรายการลงทะเบียน', 'RegisTable.png', 1);
INSERT INTO pageimages(pageimage_id, pageimage_name, picture, program_id) VALUES (3, 'หน้าจอบันทึกข้อมูล', 'SaveRegis.png', 1);
INSERT INTO pageimages(pageimage_id, pageimage_name, picture, program_id) VALUES (4, 'เพิ่มพนักงานเข้าโครงการ', 'pg_add_employee.png', 2);
INSERT INTO pageimages(pageimage_id, pageimage_name, picture, program_id) VALUES (5, 'หน้าสร้างแบบทดสอบ', 'exam_create.png', 3);

INSERT INTO formtype(formtype_id, formtype_name) VALUES (1, 'Other');
INSERT INTO formtype(formtype_id, formtype_name) VALUES (2, 'Textbox');
INSERT INTO formtype(formtype_id, formtype_name) VALUES (3, 'Datepicker');
INSERT INTO formtype(formtype_id, formtype_name) VALUES (4, 'Radio');
INSERT INTO formtype(formtype_id, formtype_name) VALUES (5, 'Checkbox');
INSERT INTO formtype(formtype_id, formtype_name) VALUES (6, 'Button');
INSERT INTO formtype(formtype_id, formtype_name) VALUES (7, 'Dropdown');
INSERT INTO formtype(formtype_id, formtype_name) VALUES (8, 'Textarea');
INSERT INTO formtype(formtype_id, formtype_name) VALUES (9, 'InputSwitch');


INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (1, 'ชื่อ', 'firstName',  2, 'Maxlength: 20, ใช้ตัวอักษร', 1, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (2, 'นามสกุล', 'lastName',  2, 'Default', 1, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (3, 'อีเมล', 'email',  2, 'Default', 1, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event, service_id) VALUES (4, 'รายวิชา', 'couseId',  7, 'Default', 1, 'ทําการค้นหาข้อมูลรายวิชามาทําเป็น dropdown โดยเรียก Service /api/course', 2);
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (5, 'สถานะ', 'status',  9, 'Default', 1, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event, service_id) VALUES (6, 'ปุ่มค้นหา', 'searchBtn',  6, 'Default', 1, 'เมื่อกดปุ่มค้นหาให้ทําการแสดงตารางและเรียก Service /api/registrations/queryRegisByCondition และแสดงผลข้อมูลที่ค้นหาได้', 6);
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (7, 'ปุ่มยกเลิก', 'cancelBtn',  6, 'Default', 1, 'เมื่อกดปุ่ม ทําการ clear form, ตารางการแสดงผล และแสดงผลหน้าจอเริ่มต้น');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (8, 'ปุ่มเพิ่ม', 'addBtn',  6, 'Default', 1, 'เมื่อกดปุ่ม 1. เปิดหน้าจอบันทึก 2. Clear หน้าจอสําหรับการเพิ่มข้อมูล');

INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (9, 'วันที่ลงทะเบียน', 'regisDate',  1, 'Default', 2, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (10, 'ชื่อ-นามสกุล', 'fullName',  1, 'Default', 2, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (11, 'รายวิชา', 'courseName',  1, 'Default', 2, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (12, 'อีเมล์', 'email',  1, 'Default', 2, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (13, 'เบอร์โทร', 'tel',  1, 'Default', 2, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (14, 'สถานะ', 'status',  9, 'Y: ใช้งาน, N: ยกเลิก', 2, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event, service_id) VALUES (15, 'ปุ่มแก้ไข', 'editBtn',  6, 'Default', 2, 'เมื่อกดปุ่ม1. เปิดหน้าจอแก้ไข2. ทําการค้นหาข้อมูลโดยเรียก Service /api/registrations/{id:Long}3. Set ค่าที่ได้จากการค้นหาให้กับหน้าจอ', 3);
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event, service_id) VALUES (16, 'ปุ่มลบ', 'deleteBtn',  6, 'Default', 2, 'เมื่อกดปุ่ม ให้ทําการเรียก Service /api/registrations/{id:Long}1. เมื่อลบข้อมูลสําเร็จให้ alert ลบข้อมูลสําเร็จ2. อัพเดตข้อมูลในตาราง', 7);

INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (17, 'วันที่ลงทะเบียน', 'regisDate',  3, 'Property: required', 3, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event, service_id) VALUES (18, 'รายชื่อนักศึกษา', 'studentId',  7, 'Property: required', 3, 'ทําการค้นหาข้อมูลรายวิชามาทําเป็น dropdown โดยเรียก Service /api/student', 1);
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event, service_id) VALUES (19, 'รายวิชา', 'courseId',  7, 'Property: required', 3, 'ทําการค้นหาข้อมูลรายวิชามาทําเป็น dropdown โดยเรียก Service /api/course', 2);
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (20, 'ราคาหน่วยกิต', 'price',  2, 'Property: disabled', 3, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (21, 'สถานะ', 'Status',  9, 'Default', 3, 'None');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event, service_id) VALUES (22, 'ปุ่มบันทึก', 'saveBtn',  6, 'Default', 3, 'เมื่อกดปุ่มบันทึก 1. ตรวจสอบการ Validate ที่หน้าจอ 2. ให้เรียก Service /api/registrations สําหรับบันทึกข้อมูล 3. เมื่อบันทึกข้อมูลเรียบร้อยให้ Alert บันทึกข้อมูลเรียบร้อย ทําการ clear หน้าจอ เพื่อพร้อมเพิ่มข้อมูลใหม่', 4);
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event, service_id) VALUES (23, 'ปุ่มแก้ไข', 'editBtn',  6, 'Default', 3, 'เมื่อกดปุ่มแก้ไข 1. ตรวจสอบการ Validate ที่หน้าจอ 2. ให้เรียก Service /api/registrations สําหรับแก้ไขข้อมูล 3. เมื่อแก้ไขข้อมูลเรียบร้อยให้ alert แก้ไขข้อมูลเรียบร้อย', 5);
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (24, 'ปุ่มยกเลิก', 'cancelBtn',  6, 'Default', 3, 'เมือกดปุ่ม 1. ถ้า regisId มีค่า -ทําการ clear หน้าจอ - ทําการค้นหาข้อมูลเป็นค่าเริ่มต้นสําหรับแก้ไขข้อมูล2. ถ้า regisId ไม่มีค่า - ทําการ clear หน้าจอเป็นค่าเริ่มต้นสําหรับเพิ่มข้อมูล');
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event) VALUES (25, 'ปุ่มกลับ', 'backBtn',  6, 'Default', 3, 'เมื่อกดปุ่ม กลับไปหน้าจอค้นหาข้อมูล');

INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event, service_id) VALUES (26, 'รหัสพนักงาน', 'employeeId',  1, 'Default', 4, 'ตรวจสอบการ Validate', 8);
INSERT INTO uispecs(uispec_id, label, attribure, formtype_id, detail, pageimage_id, event, service_id) VALUES (27, 'หมวดหมู่', 'categoryId',  7, 'Default', 5, 'ทําการค้นหาข้อมูลหมวดหมู่มาทําเป็น dropdown โดยเรียก Service /api/testService', 8);

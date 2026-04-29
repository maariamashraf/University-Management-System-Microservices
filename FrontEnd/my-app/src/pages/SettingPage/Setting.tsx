import { getRole } from "../../Services/userService";
import StudentSetting from "./StudentSetting";
import TeacherSetting from "./TeacherSetting";
import ErrorPage from "../../components/common/ErrorPage";
export default function Setting() {
  // there is an error with courses teacher tab  it give us error page 
  // remove the unnecessary features from the setting pages for both student and teacher
    const role = getRole();

    if (role === "student") {
        return <StudentSetting />;
    } else if (role === "teacher") {
        return <TeacherSetting />;
    } else {
        return <ErrorPage />;
    }

}
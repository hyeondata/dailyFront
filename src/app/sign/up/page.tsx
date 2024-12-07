// "use client";
// import { FormEvent, useState } from "react";
// import * as styles from "./index.module.css";
// import { useRouter } from "next/navigation";

// const SignUpPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordCheck, setPasswordCheck] = useState("");
//   const [userName, setUserName] = useState("");
//   const router = useRouter();

//   const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEmail(e.target.value);
//   };

//   const onChangePw = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//   };

//   const onChangePwCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPasswordCheck(e.target.value);
//   };

//   const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setUserName(e.target.value);
//   };

//   const onChangeNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNickName(e.target.value);
//   };

//   const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (password !== passwordCheck) {
//       alert("비밀번호가 일치하지 않습니다.");
//       return;
//     }

//     try {
//       // 회원가입 데이터를 JSON 형태로 만듭니다.
//       const userData = {
//         email,
//         password,
//         userName,
//       };

//       // 회원가입 API에 데이터를 POST 요청으로 보냅니다.
//       fetch("http://localhost:3000/api/user", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       }).then((res) => {
//         if (res.ok) {
//           alert("회원가입이 완료되었습니다.");
//           router.push("/signin");
//         }
//       });
//     } catch {}
//   };

//   return (
//     <div className={styles.root}>
//       <h2 className={styles.h1}>회원가입</h2>
//       <form onSubmit={onSubmit}>
//         {/* 아이디 */}
//         <div className={styles.inputBox2}>
//           <label htmlFor="id" className={styles.p}>
//             아이디
//           </label>
//           <input
//             type="text"
//             id="id"
//             name="id"
//             value={email}
//             onChange={onChangeId}
//             required
//           />
//           <button className={styles.idBtn}>중복확인</button>
//         </div>

//         {/* 비밀번호 */}
//         <div className={styles.inputBox}>
//           <label htmlFor="password" className={styles.p}>
//             비밀번호
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={password}
//             onChange={onChangePw}
//             required
//           />
//         </div>

//         {/* 비밀번호 확인 */}
//         <div className={styles.inputBox}>
//           <label htmlFor="passwordCheck" className={styles.p}>
//             비밀번호 확인
//           </label>
//           <input
//             type="password"
//             id="passwordCheck"
//             name="passwordCheck"
//             value={passwordCheck}
//             onChange={onChangePwCheck}
//             required
//           />

//           {password !== passwordCheck && "비밀번호가 일치하지 않습니다."}
//         </div>

//         {/* 이름 */}
//         <div className={styles.inputBox}>
//           <label htmlFor="name" className={styles.p}>
//             이름
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={userName}
//             onChange={onChangeUserName}
//             required
//           />
//         </div>

//         {/* 회원가입 버튼 */}
//         <div className={styles.buttonBox}>
//           <button type="submit">회원가입</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SignUpPage;

"use client";
import { FormEvent, useState } from "react";
import styles from "./index.module.css";  // * as styles 를 styles로 변경
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();

  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangePwCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value);
  };

  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  // 이메일 중복 확인
  const checkEmailDuplicate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 폼 제출 방지
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/user/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("사용 가능한 이메일입니다.");
      } else {
        alert(data.error || "이미 사용 중인 이메일입니다.");
      }
    } catch (error) {
      console.error("이메일 중복 확인 에러:", error);
      alert("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const userData = {
        email,
        password,
        name: userName, // API 요청 body와 맞춤
      };

      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "회원가입 중 오류가 발생했습니다.");
        return;
      }

      alert("회원가입이 완료되었습니다.");
      router.push("/signin");
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("회원가입 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.root}>
      <h2 className={styles.h1}>회원가입</h2>
      <form onSubmit={onSubmit}>
        {/* 아이디 */}
        <div className={styles.inputBox2}>
          <label htmlFor="id" className={styles.p}>
            아이디
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={email}
            onChange={onChangeId}
            required
          />
          <button className={styles.idBtn} onClick={checkEmailDuplicate}>
            중복확인
          </button>
        </div>
        {/* 비밀번호 */}
        <div className={styles.inputBox}>
          <label htmlFor="password" className={styles.p}>
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChangePw}
            required
          />
        </div>
        {/* 비밀번호 확인 */}
        <div className={styles.inputBox}>
          <label htmlFor="passwordCheck" className={styles.p}>
            비밀번호 확인
          </label>
          <input
            type="password"
            id="passwordCheck"
            name="passwordCheck"
            value={passwordCheck}
            onChange={onChangePwCheck}
            required
          />
          {password !== passwordCheck && (
            <p className="text-red-500">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>
        {/* 이름 */}
        <div className={styles.inputBox}>
          <label htmlFor="name" className={styles.p}>
            이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={userName}
            onChange={onChangeUserName}
            required
          />
        </div>
        {/* 회원가입 버튼 */}
        <div className={styles.buttonBox}>
          <button type="submit">회원가입</button>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
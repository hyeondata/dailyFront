"use client";

import Link from "next/link";
import * as styles from "./index.module.css";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [blankId, setBlankId] = useState(false);
  const [blankPw, setBlankPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/afterLogin");  // 로그인 후 리다이렉트할 경로
    }
  }, [session, router]);

  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    setBlankId(false);
    setError(null);
  };

  const onChangePw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setBlankPw(false);
    setError(null);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (id.length <= 0) {
      setBlankId(true);
      return;
    }
    if (password.length <= 0) {
      setBlankPw(true);
      return;
    }

    if (!blankId && !blankPw) {
      try {
        const result = await signIn("credentials", {
          username: id,
          password: password,
          redirect: false,
        });

        if (result?.ok) {  // 로그인 성공
          alert("로그인이 완료되었습니다.");
          const callbackUrl = searchParams.get("callbackUrl") || "/";
          router.push(callbackUrl);
        } else {  // 로그인 실패
          setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
      } catch (error) {
        console.error("로그인 에러:", error);
        setError("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className={styles.root}>
      <h2 className={styles.h1}>로그인</h2>
      <form onSubmit={onSubmit}>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        {/* 아이디 */}
        <div className={styles.inputBox}>
          <p className={styles.p}>ID</p>
          <input
            type="text"
            name="id"
            value={id}
            onChange={onChangeId}
            required
          />
          {blankId && <span className={styles.errorText}>아이디를 입력해주세요</span>}
        </div>

        {/* 비밀번호 */}
        <div className={styles.inputBox}>
          <p className={styles.p}>PASSWORD</p>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChangePw}
            required
          />
          {blankPw && <span className={styles.errorText}>비밀번호를 입력해주세요</span>}
        </div>

        {/* 로그인 버튼 */}
        <div className={styles.buttonBox}>
          <button type="submit">로그인</button>
          <div className={styles.navi}>
            <Link href="/">ID/PW 찾기</Link>
            <Link href="/sign/up">회원가입</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
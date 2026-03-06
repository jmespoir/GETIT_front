# React + Vite

## 모집 기간 / 타임존 (Recruitment period)

- **프론트**: 관리자 설정에서는 **한국 시간(KST)** 만 입력·표시합니다. 저장 시 KST를 UTC ISO 8601(`...Z`)로 변환해 `PATCH /api/recruitment/status`로 전달합니다.
- **백엔드**: 서버는 받은 값을 **그대로 저장**하고, 모집 여부(`isOpen`) 판단 시 **현재 시각을 UTC로** 비교하면 됩니다. GET 시 `startAt`/`endAt`을 UTC ISO 문자열로 내려주면 프론트에서 KST로 변환해 표시합니다.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

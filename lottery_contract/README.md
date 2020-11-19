# lottery_contract

- Lottery Contract

- Variables (변수) - 누가, 무엇이 존재하는가?

1. 매니저(Manager) => 컨트랙트를 생성하는 사람의 주소
2. 플레이어(Players) => Lottery라는 게임의 참가하는 사람들(주소)

- Function (함수) - 어떠한 기능들이 존재하는가?

1. enter (참여) - lottery 게임에 플레이어들이 참여
2. pickWinnter (승자 고르기) - 무작위로 승자를 고르고, 승자에게는 상금을 전송

-- 솔리디티 (Solidity)는 강타입 언어(Strong-typed Language)
uint8: 0 ~ 255 => 숫자 값이 무조건 0부터 255 사이에 들어 옴

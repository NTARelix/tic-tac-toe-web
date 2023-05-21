/** @typedef {' ' | 'X' | 'O'} Token */
/** @typedef {`${Token}${Token}${Token}\n${Token}${Token}${Token}\n${Token}${Token}${Token}`} Board */

const INITIAL_STATE = '   \n   \n   '

class TicTacToe extends HTMLElement {
  /** @type {Token} */
  #turn
  /** @type {Board} */
  #board
  /** @type {ShadowRoot} */
  #shadow
  constructor() {
    super()
    this.#shadow = this.attachShadow({ mode: 'closed' })
    this.#resetBoard()
    this.#render()
  }
  #resetBoard() {
    this.#turn = 'X'
    this.#board = INITIAL_STATE
  }
  /**
   * @param {0 | 1 | 2} x
   * @param {0 | 1 | 2} y
   * @returns {0 | 1 | 2 | 4 | 5 | 6 | 8 | 9 | 10}
   */
  #getTokenIndex(x, y) {
    if (x === 0 && y === 0) return 0
    else if (x === 1 && y === 0) return 1
    else if (x === 2 && y === 0) return 2
    else if (x === 0 && y === 1) return 4
    else if (x === 1 && y === 1) return 5
    else if (x === 2 && y === 1) return 6
    else if (x === 0 && y === 2) return 8
    else if (x === 1 && y === 2) return 9
    else if (x === 2 && y === 2) return 10
  }
  /**
   * @param {0 | 1 | 2} x
   * @param {0 | 1 | 2} y
   * @returns {Token}
   */
  #getToken(x, y) {
    const index = this.#getTokenIndex(x, y)
    return this.#board[index]
  }
  /** @returns {'X' | 'O' | null} */
  #getVictor() {
    const winPatterns = [
      [this.#getToken(0, 0), this.#getToken(1, 0), this.#getToken(2, 0)], // top row
      [this.#getToken(0, 1), this.#getToken(1, 1), this.#getToken(2, 1)], // middle row
      [this.#getToken(0, 2), this.#getToken(1, 2), this.#getToken(2, 2)], // bottom row
      [this.#getToken(0, 0), this.#getToken(0, 1), this.#getToken(0, 2)], // left column
      [this.#getToken(1, 0), this.#getToken(1, 1), this.#getToken(1, 2)], // middle column
      [this.#getToken(2, 0), this.#getToken(2, 1), this.#getToken(2, 2)], // right column
      [this.#getToken(0, 0), this.#getToken(1, 1), this.#getToken(2, 2)], // top-left to bottom right
      [this.#getToken(2, 0), this.#getToken(1, 1), this.#getToken(0, 2)], // top-right to bottom left
    ]
    const winningPattern = winPatterns.find(pattern => (
      pattern.every(token => token === 'X') || pattern.every(token => token === 'O')
    ))
    return winningPattern?.[0] ?? null
  }
  /**
   * @param {0 | 1 | 2} x
   * @param {0 | 1 | 2} y
   * @param {Token} token
   */
  #playToken(x, y) {
    const index = this.#getTokenIndex(x, y)
    if (this.#board[index] === ' ' && this.#getVictor() === null) {
      this.#board = this.#board.substring(0, index) + this.#turn + this.#board.substring(index + 1)
      this.#turn = this.#turn === 'X' ? 'O' : 'X'
      this.#render()
    }
  }
  #render() {
    const victor = this.#getVictor()
    this.#shadow.innerHTML = `
      <style>
        .board {
          display: inline-grid;
          grid-template-columns: [start] 60px [left-line] 60px [right-line] 60px [end];
          grid-template-rows: [start] 60px [top-line] 60px [bottom-line] 60px [end];
          justify-items: stretch;
          align-items: stretch;
          font-size: 56px;
        }
        /** Cell Decoration */
        .playing [id^=token]:hover {
          background-color: #eee;
        }
        .playing [id^=token] {
          cursor: pointer;
        }
        [id^=token] {
          text-align: center;
        }
        /** Sizing */
        [id^=token] { grid-column-end: span 1; grid-row-end: span 1; }
        /** Positioning */
        #token-00 { grid-column-start: start; grid-row-start: start; }
        #token-10 { grid-column-start: left-line; grid-row-start: start; }
        #token-20 { grid-column-start: right-line; grid-row-start: start; }
        #token-01 { grid-column-start: start; grid-row-start: top-line; }
        #token-11 { grid-column-start: left-line; grid-row-start: top-line; }
        #token-21 { grid-column-start: right-line; grid-row-start: top-line; }
        #token-02 { grid-column-start: start; grid-row-start: bottom-line; }
        #token-12 { grid-column-start: left-line; grid-row-start: bottom-line; }
        #token-22 { grid-column-start: right-line; grid-row-start: bottom-line; }
        /** Vertical borders */
        #token-10,
        #token-11,
        #token-12 {
          border-left: 1px solid black;
          border-right: 1px solid black;
        }
        /** Horizontal Borders */
        #token-01,
        #token-11,
        #token-21 {
          border-top: 1px solid black;
          border-bottom: 1px solid black;
        }
      </style>
      <div class="board${victor === null ? ' playing' : ' victory'}">
        <div id="token-00">${this.#getToken(0, 0)}</div>
        <div id="token-10">${this.#getToken(1, 0)}</div>
        <div id="token-20">${this.#getToken(2, 0)}</div>
        <div id="token-01">${this.#getToken(0, 1)}</div>
        <div id="token-11">${this.#getToken(1, 1)}</div>
        <div id="token-21">${this.#getToken(2, 1)}</div>
        <div id="token-02">${this.#getToken(0, 2)}</div>
        <div id="token-12">${this.#getToken(1, 2)}</div>
        <div id="token-22">${this.#getToken(2, 2)}</div>
      </div>
    `
    if (victor === null) {
      this.#shadow.getElementById('token-00')?.addEventListener('click', () => this.#playToken(0, 0))
      this.#shadow.getElementById('token-10')?.addEventListener('click', () => this.#playToken(1, 0))
      this.#shadow.getElementById('token-20')?.addEventListener('click', () => this.#playToken(2, 0))
      this.#shadow.getElementById('token-01')?.addEventListener('click', () => this.#playToken(0, 1))
      this.#shadow.getElementById('token-11')?.addEventListener('click', () => this.#playToken(1, 1))
      this.#shadow.getElementById('token-21')?.addEventListener('click', () => this.#playToken(2, 1))
      this.#shadow.getElementById('token-02')?.addEventListener('click', () => this.#playToken(0, 2))
      this.#shadow.getElementById('token-12')?.addEventListener('click', () => this.#playToken(1, 2))
      this.#shadow.getElementById('token-22')?.addEventListener('click', () => this.#playToken(2, 2))
    }
  }
}

customElements.define('tic-tac-toe', TicTacToe)

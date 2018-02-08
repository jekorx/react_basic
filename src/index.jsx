import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import '@styles/reset'
import App from '@/app'

// 使用react-hot-loader模块热更新
if (module.hot) {
  module.hot.accept(() => {
    render(
      <AppContainer>
        <App />
      </AppContainer>,
      document.getElementById('root')
    )
  })
}

render(
  <App />,
  document.getElementById('root')
)

import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: string | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) return (
      <div className="m-6 p-6 bg-red-50 border border-red-200 rounded">
        <h2 className="font-bold text-red-700">Something went wrong</h2>
        <p className="text-red-600 text-sm mt-2">{this.state.error}</p>
        <button onClick={() => this.setState({ error: null })} className="mt-4 text-sm underline text-red-600">Try again</button>
      </div>
    )
    return this.props.children
  }
}

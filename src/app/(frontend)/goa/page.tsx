import { redirect } from 'next/navigation'

// The /goa base path has no landing of its own — send visitors to the home page.
export default function GoaIndex() {
  redirect('/')
}

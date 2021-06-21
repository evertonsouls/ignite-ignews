import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession, getSession } from 'next-auth/client'
import { getPrismicClient } from '../../services/prismic'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'

const post = { slug: 'my-new-post', title: 'My New Post', content: 'Post excerpt', updatedAt: '10, March'}

jest.mock('../../services/prismic')
jest.mock('next-auth/client')

describe('Post page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' } as any,
      false
    ])

    render(<Post post={post}  />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({ params: {slug: 'my-new-post'}} as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
    
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({ activeSubscription: 'fake-active-subscription'})
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post' }
          ],
          content: [
            { type: 'paragraph', text: 'Post content' }
          ],
        },
        last_publication_date: '04-01-2021'
      })
    } as any)

    const response = await getServerSideProps({ params: {slug: 'my-new-post'}} as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: 'April 01, 2021',
          }
        }
      })
    )    
  })

})
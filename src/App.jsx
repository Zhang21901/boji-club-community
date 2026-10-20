import { useMemo, useState } from 'react'
import {
  Bell,
  Bookmark,
  Bot,
  ChevronDown,
  CircleHelp,
  Compass,
  Flame,
  Hash,
  Heart,
  Home,
  ImagePlus,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Share2,
  Sparkles,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import './App.css'

const initialPosts = [
  {
    id: 1,
    author: '林响',
    handle: '@linxiang',
    time: '12 分钟',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    tag: '大水理论',
    title: '喝水这件事，终于被薄肌人研究明白了',
    text: '训练日 3.5L，非训练日 2.8L。不是玄学，是给状态一个稳定的底座。谁还在拿咖啡当水喝？',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1100&q=85',
    likes: 428,
    comments: 76,
    shares: 19,
  },
  {
    id: 2,
    author: 'Mina',
    handle: '@minaboji',
    time: '34 分钟',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    tag: '校园联盟',
    title: '港校薄肌俱乐部第一次晨练打卡',
    text: '不卷数字，卷长期。我们把操场分成了快走、力量和拉伸三个区，新人随时加入。',
    likes: 186,
    comments: 42,
    shares: 11,
  },
  {
    id: 3,
    author: '睡眠派代表',
    handle: '@sleepscience',
    time: '1 小时',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    tag: '大睡理论',
    title: '大睡理论不是躺平，是恢复力的核心资产',
    text: '今晚先把屏幕放下 30 分钟。明天的训练质量，很多时候在今天入睡前就已经决定了。',
    likes: 365,
    comments: 91,
    shares: 37,
  },
]

const channels = [
  { name: '推荐', icon: Compass },
  { name: '水站', icon: Flame },
  { name: '训练场', icon: Trophy },
  { name: '大睡区', icon: Heart },
  { name: '校园联盟', icon: Users },
]

function App() {
  const [activeChannel, setActiveChannel] = useState('推荐')
  const [posts, setPosts] = useState(initialPosts)
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [savedPosts, setSavedPosts] = useState(new Set())
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const [toast, setToast] = useState('')

  const visiblePosts = useMemo(() => {
    if (!query.trim()) return posts
    const keyword = query.toLowerCase()
    return posts.filter((post) =>
      [post.author, post.title, post.text, post.tag].join(' ').toLowerCase().includes(keyword),
    )
  }, [posts, query])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const publishPost = () => {
    const text = draft.trim()
    if (!text) {
      notify('先写点你的 BOJI 见解')
      return
    }
    setPosts((current) => [
      {
        id: Date.now(),
        author: '你',
        handle: '@newboji',
        time: '刚刚',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        tag: activeChannel === '推荐' ? '新鲜分享' : activeChannel,
        title: text.length > 28 ? `${text.slice(0, 28)}...` : text,
        text,
        likes: 0,
        comments: 0,
        shares: 0,
      },
      ...current,
    ])
    setDraft('')
    notify('已发布到 BOJI Club')
  }

  const toggleSet = (setter, id, message) => {
    setter((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    notify(message)
  }

  const sharePost = async (post) => {
    const shareText = `${post.title} - ${post.text}`
    try {
      if (navigator.share) await navigator.share({ title: 'BOJI Club', text: shareText })
      else await navigator.clipboard.writeText(shareText)
      notify('已准备分享内容')
    } catch {
      // User canceled the native sharing surface.
    }
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#feed">跳到内容</a>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="BOJI Club 首页">
          <span className="brand-mark">B</span>
          <span>BOJI <b>CLUB</b></span>
        </a>
        <div className="global-search">
          <Search size={18} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜话题、理论、薄肌伙伴"
            aria-label="搜索社区内容"
          />
        </div>
        <div className="top-actions">
          <button className="icon-button" type="button" aria-label="查看通知" onClick={() => notify('今天还没有新通知')}>
            <Bell size={20} />
            <span className="notification-dot" />
          </button>
          <button className="user-menu" type="button" onClick={() => notify('个人中心开发中')}>
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80" alt="你的头像" />
            <span>Neo</span><ChevronDown size={15} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="layout" id="top">
        <aside className="left-rail" aria-label="主导航">
          <nav className="side-nav">
            <a className="nav-item active" href="#feed"><Home size={20} aria-hidden="true" /> 首页</a>
            <button className="nav-item" type="button" onClick={() => notify('发现页准备中')}><Compass size={20} aria-hidden="true" /> 发现</button>
            <button className="nav-item" type="button" onClick={() => notify('你还没有收藏')}><Bookmark size={20} aria-hidden="true" /> 收藏</button>
          </nav>

          <div className="rail-section">
            <div className="section-label">我的圈子 <button type="button" aria-label="添加圈子"><Plus size={15} /></button></div>
            {channels.map(({ name, icon: Icon }) => (
              <button
                className={`channel ${activeChannel === name ? 'selected' : ''}`}
                type="button"
                key={name}
                onClick={() => setActiveChannel(name)}
              >
                <Icon size={17} aria-hidden="true" /> {name}
              </button>
            ))}
          </div>

          <div className="club-card">
            <div className="club-card-orbit" />
            <span className="eyebrow">CAMPUS NETWORK</span>
            <strong>薄肌俱乐部<br />全球高校联盟</strong>
            <span>36 所高校正在连接</span>
            <button type="button" onClick={() => notify('申请入口已打开')}>申请成为校园主理人 <Send size={14} /></button>
          </div>
        </aside>

        <main className="feed" id="feed">
          <section className="feed-head">
            <div>
              <p className="eyebrow">TODAY IN BOJI</p>
              <h1>{activeChannel}</h1>
            </div>
            <button className="filter-button" type="button" onClick={() => notify('已按热度排序')}><Flame size={17} /> 热门 <ChevronDown size={15} /></button>
          </section>

          <section className="topic-strip" aria-label="热门话题">
            <button type="button" onClick={() => setQuery('大水理论')}><Hash size={15} /> 大水理论</button>
            <button type="button" onClick={() => setQuery('大睡理论')}><Hash size={15} /> 大睡理论</button>
            <button type="button" onClick={() => setQuery('AI')}><Sparkles size={15} /> AI 训练搭子</button>
            <button type="button" onClick={() => setQuery('邵艾伦')}><Hash size={15} /> 邵艾伦</button>
          </section>

          <section className="composer" aria-label="发布新动态">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80" alt="你的头像" />
            <div className="composer-body">
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="今天，有什么 BOJI 时刻？" aria-label="发布内容" />
              <div className="composer-footer">
                <div className="composer-tools">
                  <button type="button" aria-label="添加图片" onClick={() => notify('图片上传将在下一版开放')}><ImagePlus size={19} /></button>
                  <button type="button" aria-label="添加话题" onClick={() => setDraft((value) => `${value}${value ? ' ' : ''}#大水理论`)}><Hash size={19} /></button>
                  <button type="button" aria-label="让 AI 润色" onClick={() => setIsAssistantOpen(true)}><Sparkles size={19} /></button>
                </div>
                <button className="publish-button" type="button" onClick={publishPost}><Send size={17} /> 发布</button>
              </div>
            </div>
          </section>

          <div className="feed-list" aria-live="polite">
            {visiblePosts.length ? visiblePosts.map((post) => (
              <article className="post" key={post.id}>
                <img className="avatar" src={post.avatar} alt={`${post.author}的头像`} />
                <div className="post-body">
                  <header className="post-header">
                    <div><strong>{post.author}</strong><span>{post.handle}</span><span>· {post.time}</span></div>
                    <button className="post-menu" type="button" aria-label={`更多 ${post.author} 的帖子操作`}><MoreHorizontal size={20} /></button>
                  </header>
                  <button className="post-content" type="button" onClick={() => notify('帖子详情准备中')}>
                    <span className="post-tag">{post.tag}</span>
                    <h2>{post.title}</h2>
                    <p>{post.text}</p>
                  </button>
                  {post.image && <img className="post-image" src={post.image} alt="社区成员在健身房训练" />}
                  <footer className="post-actions">
                    <button type="button" onClick={() => notify('评论功能准备中')}><MessageCircle size={19} /><span>{post.comments}</span></button>
                    <button className={likedPosts.has(post.id) ? 'is-active' : ''} type="button" onClick={() => toggleSet(setLikedPosts, post.id, likedPosts.has(post.id) ? '已取消支持' : '已支持这条内容')}><Heart size={19} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} /><span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span></button>
                    <button type="button" onClick={() => sharePost(post)}><Share2 size={19} /><span>{post.shares}</span></button>
                    <button className={savedPosts.has(post.id) ? 'is-active save-action' : 'save-action'} type="button" aria-label="收藏帖子" onClick={() => toggleSet(setSavedPosts, post.id, savedPosts.has(post.id) ? '已取消收藏' : '已收藏')}><Bookmark size={19} fill={savedPosts.has(post.id) ? 'currentColor' : 'none'} /></button>
                  </footer>
                </div>
              </article>
            )) : <div className="empty-state"><Search size={26} /><strong>没有找到相关讨论</strong><span>换个关键词，或者直接发起一个新话题。</span></div>}
          </div>
        </main>

        <aside className="right-rail" aria-label="社区侧栏">
          <section className="pulse-panel">
            <div className="panel-heading"><div><span className="status-dot" /> BOJI PULSE</div><span>实时</span></div>
            <div className="pulse-number">8,452</div>
            <p>此刻正在交流的薄肌伙伴</p>
            <div className="pulse-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </section>

          <section className="side-section trend-section">
            <div className="side-heading"><h2>热聊榜</h2><button type="button" onClick={() => notify('热聊榜已刷新')}>换一批</button></div>
            {[
              ['01', '孙宇晨的高效作息，到底靠什么？', '12.8k 讨论'],
              ['02', '邵艾伦的薄肌审美图鉴', '8.2k 讨论'],
              ['03', '大睡理论挑战：连续 7 天', '6.7k 讨论'],
              ['04', 'AI 能否替代你的训练搭子', '5.1k 讨论'],
            ].map(([rank, title, stat]) => <button className="trend" type="button" key={rank} onClick={() => setQuery(title)}><span>{rank}</span><div><strong>{title}</strong><small>{stat}</small></div></button>)}
          </section>

          <section className="ai-card">
            <div className="ai-icon"><Bot size={22} /></div>
            <div><span className="eyebrow">BOJI AI</span><h2>今天练什么？</h2><p>基于你的状态生成 20 分钟轻量计划。</p></div>
            <button type="button" onClick={() => setIsAssistantOpen(true)}>问问 AI <Sparkles size={15} /></button>
          </section>

          <p className="disclaimer"><CircleHelp size={13} /> 社区话题仅代表用户讨论，不构成任何人物、机构或健康建议。</p>
        </aside>
      </div>

      <nav className="mobile-nav" aria-label="移动端导航">
        <a href="#feed" className="active"><Home size={21} /><span>首页</span></a>
        <button type="button" onClick={() => notify('发现页准备中')}><Compass size={21} /><span>发现</span></button>
        <button className="mobile-create" type="button" aria-label="发布动态" onClick={() => document.querySelector('.composer textarea')?.focus()}><Plus size={24} /></button>
        <button type="button" onClick={() => setIsAssistantOpen(true)}><Bot size={21} /><span>AI</span></button>
        <button type="button" onClick={() => notify('个人中心开发中')}><Users size={21} /><span>我的</span></button>
      </nav>

      {isAssistantOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsAssistantOpen(false)}>
        <section className="assistant-modal" role="dialog" aria-modal="true" aria-label="BOJI AI 助手" onMouseDown={(event) => event.stopPropagation()}>
          <button className="icon-button modal-close" type="button" aria-label="关闭 AI 助手" onClick={() => setIsAssistantOpen(false)}><X size={21} /></button>
          <div className="assistant-hero"><div className="ai-icon"><Bot size={25} /></div><span className="eyebrow">BOJI AI</span><h2>把今天的状态告诉我</h2><p>我会按大水、大睡和轻训练原则，给你一份轻量建议。</p></div>
          <div className="suggestion-grid">
            <button type="button" onClick={() => notify('AI 建议：轻力量 15 分钟 + 快走 20 分钟。')}>今天只睡了 6 小时</button>
            <button type="button" onClick={() => notify('AI 建议：先补水 500ml，再进行拉伸和低强度训练。')}>下午一直没喝水</button>
            <button type="button" onClick={() => notify('AI 建议：保持节奏，完成一次 30 分钟全身循环。')}>状态很好，想挑战一下</button>
          </div>
          <div className="assistant-input"><input placeholder="描述你的状态..." aria-label="描述你的状态" /><button type="button" onClick={() => notify('AI 正在整理你的 BOJI 计划')} aria-label="发送给 AI"><Send size={18} /></button></div>
        </section>
      </div>}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

export default App

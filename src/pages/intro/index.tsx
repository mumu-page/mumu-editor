import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import classNames from 'classnames'
import { useStore } from 'react-redux'
import styles from './index.module.less'

function Intro() {
    const store = useStore()
    console.log('store', store.getState());
    
    const style = {
        'transform': 'translate(0px, 0px)',
        'opacity': 1
    }
    return (
        <div className={styles.intro}>
            <Header />
            <div className={styles['kaer-home-banner']} >
                <div className={styles['fd-home-banner-content']}>
                    <div className={styles["fd-home-banner-content-info"]}>
                        <h1 className="" style={style}>
                            极简制作，一键呈现
                        </h1>
                        <p className="" style={style}>
                            海量组件、模板，随意使用<br />
                            支持自定义开发组件、模板，满足不同场景的业务诉求
                        </p>
                        <div className="" style={style}>
                            <Link to="/dashboard">
                                <button type="button" className={`${styles["fdAnt-btn"]} ${styles['fd-guide-btn']}`}>
                                    <span>开始使用</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className={`${styles["fd-home-banner-content-img"]}`}></div>
                </div>
                <i className={styles["fd-home-banner-bottom"]}></i>
            </div>
            <div className={styles["kaer-home-intro"]}>
                <h2>
                    <strong>快速、简单、易用的可视化搭建平台</strong>
                </h2>
                <p>
                    零门槛快速搭建、快速投放。数据实时回流，方便及时快速调整投放策略&方案
                </p>
                <div
                    className={`${styles["wow animate__fadeInUp"]} ${styles['kaer-home-intro-img']}`}
                    data-wow-duration="1s"
                    data-wow-offset="100"
                />
            </div>
            <div className={styles["kaer-feat"]}>
                <h2
                    data-wow-duration="1s"
                    data-wow-offset="300"
                    className={classNames(styles["kaer-subtitle"], styles['animate__fadeInUp'], styles['wow'])}
                >
                    功能特性<i></i>
                </h2>
                <section>
                    <div
                        data-wow-duration="1s"
                        data-wow-offset="300"
                        className={classNames(styles['fd-home-feat-intro'], styles['animate__fadeInLeft'], styles['wow'])}
                    >
                        <i className={classNames(styles["fd-home-icon"], styles['fd-home-icon-1'])}></i>
                        <h4>精选模板</h4>
                        <p>提供了丰富的精选模板，覆盖众多场景，无需任何编程和设计经验，即可拥有一个专业的网站。</p>
                    </div>
                    <div
                        data-wow-duration="1s"
                        data-wow-offset="300"
                        className={classNames(styles['fd-home-feat-img'], styles['fd-home-feat-img-1'], styles['animate__fadeInRight'], styles['wow'])}
                    >
                        <i className={styles["fd-home-feat-img-1-1"]}></i>
                        <i className={styles["fd-home-feat-img-1-2"]}></i>
                        <i className={styles["fd-home-feat-img-1-3"]}></i>
                        <i className={styles["fd-home-feat-img-1-4"]}></i>
                    </div>
                </section>
                <section>
                    <div
                        data-wow-duration="1s"
                        data-wow-offset="300"
                        className={classNames(styles["fd-home-feat-intro"], styles['animate__fadeInLeft'], styles['wow'])}
                    >
                        <i className={styles["fd-home-icon fd-home-icon-3"]}></i>
                        <h4>轻松拖拽</h4>
                        <p>基于组件的自由搭建，所见即所得的站点内容编辑，自定义站点搭建，满足品牌个性化需求。</p>
                    </div>
                    <div
                        data-wow-duration="1s"
                        data-wow-offset="350"
                        className={classNames(styles["fd-home-feat-img"], styles['wow'], styles['animate__fadeInRight'], styles['fd-home-feat-img-3'])}
                    >
                        <i className={styles["fd-home-feat-img-3-1"]}></i>
                        <i className={styles["fd-home-feat-img-3-2"]}></i>
                        <i className={styles["fd-home-feat-img-3-3"]}></i>
                        <i className={styles["fd-home-feat-img-3-4"]}></i>
                    </div>
                </section>
                <section>
                    <div
                        data-wow-duration="1s"
                        data-wow-offset="300"
                        className={classNames(styles["fd-home-feat-intro"], styles['wow'], styles['animate__fadeInLeft'])}
                    >
                        <i className={classNames(styles["fd-home-icon"], styles['fd-home-icon-5'])}></i>
                        <h4>互动营销</h4>
                        <p>通过各种插件，快速搭建线上互动场景，如：抽奖、报名、问卷、小游戏等，增加站点黏性，提升转化效果。</p>
                    </div>
                    <div
                        data-wow-duration="1s"
                        data-wow-offset="350"
                        className={classNames(styles["fd-home-feat-img"], styles['wow'], styles['fd-home-feat-img-5'], styles['animate__fadeInRight'])}
                    >
                        <i className={styles["fd-home-feat-img-5-1"]}></i>
                        <i className={styles["fd-home-feat-img-5-2"]}></i>
                        <i className={styles["fd-home-feat-img-5-3"]}></i>
                        <i className={styles["fd-home-feat-img-5-4"]}></i>
                        <i className={styles["fd-home-feat-img-5-5"]}></i>
                        <i className={styles["fd-home-feat-img-5-6"]}></i>
                    </div>
                </section>
                <div className={styles["fd-site-step"]}>
                    <div className={styles["fd-step-content"]}>
                        <ul>
                            <li className={styles["fd-step-content-item"]}>
                                <i className={styles["fd-site-step-icon fd-site-step-icon-2"]}></i>
                                <h4>1. 选择模板</h4>
                                <p>新建站点时，选择一个模板，定义站点名称和路径</p>
                            </li>
                            <li className={styles["fd-step-content-item"]}>
                                <i className={classNames(styles["fd-site-step-icon"], styles['fd-site-step-icon-3'])}></i>
                                <h4>2. 编辑内容</h4>
                                <p>根据站点功能和风格需要，添加页面、组件和填写页面内容</p>
                            </li>
                            <li className={styles["fd-step-content-item"]}>
                                <i className={classNames(styles["fd-site-step-icon"], styles['fd-site-step-icon-4'])}></i>
                                <h4>3. 发布站点</h4>
                                <p>预览确认无误后，提交站点发布并获得站点地址</p></li>
                        </ul>
                    </div>
                    <div className={styles["fd-site-step-start"]}>
                        <Link to="/dashboard">
                            <button type="button" className={classNames(styles["fdAnt-btn"], styles['fd-guide-btn'])}>
                                <span>开始使用</span>
                            </button>
                        </Link>
                    </div>
                    <i className={styles["fd-site-step-bg-right"]}></i>
                </div>
            </div>
        </div>
    )
}

export default Intro
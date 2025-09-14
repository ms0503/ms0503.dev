import { BsTwitter } from 'react-icons/bs';
import {
    SiDiscord, SiMisskey
} from 'react-icons/si';
import boothIcon from '~/assets/booth-icon.svg';

export default function Social() {
    return (
        <>
            <h1>ソーシャルリンク</h1>
            <h2>
                <BsTwitter
                    aria-hidden
                    className="inline mr-1"
                    color="#1d9bf0"
                />
                Twitter
            </h2>
            <ul>
                <li><a href="https://twitter.com/ms0503_">メイン(@ms0503_)</a></li>
                <li><a href="https://twitter.com/mihal1073">みはる雑貨公式(@mihal1073)</a></li>
            </ul>
            <h2>
                <SiMisskey
                    aria-hidden
                    className="inline mr-1"
                    color="#a1ca03"
                />
                Misskey
            </h2>
            <ul>
                <li><a href="https://misskey.io/@ms0503">メイン(@ms0503@misskey.io)</a></li>
                <li><a href="https://misskey.niri.la/@mihal1073">mihal1073(@mihal1073@misskey.niri.la)</a></li>
            </ul>
            <h2>
                <SiDiscord
                    aria-hidden
                    className="inline mr-1"
                    color="#5865f2"
                />
                Discord
            </h2>
            <ul>
                <li>メイン(@ms0503)</li>
                <li>mihal1073(@mihal1073)</li>
            </ul>
            <h2>
                <img
                    alt=""
                    aria-hidden
                    className="inline h-[1em] mr-1 w-[1em]"
                    src={boothIcon}
                />
                BOOTH
            </h2>
            <ul>
                <li><a href="https://mihal1073.booth.pm">みはる雑貨(VRChat雑多屋)</a></li>
            </ul>
        </>
    );
}

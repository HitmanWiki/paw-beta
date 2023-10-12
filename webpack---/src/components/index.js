import install from '@/utils/installComponents'
import AddThis from './AddThis/AddThis.vue'
import AddThisNew from './AddThisNew/AddThis.vue'
import Avatar from './Avatar/Avatar.vue'
import BackLink from './BackLink/BackLink.vue'
import Breadcrumbs from './Breadcrumbs/Breadcrumbs.vue'
import BreadcrumbsNew from './BreadcrumbsNew/Breadcrumbs.vue'
import Button from './Button/Button.vue'
import ButtonNew from './ButtonNew/Button.vue'
import ButtonPrivate from './ButtonPrivate/Button.vue'
import Checkbox from './Checkbox/Checkbox.vue'
import CheckboxNew from './CheckboxNew/CheckboxNew.vue'
import CopiedBlock from './CopiedBlock/CopiedBlock.vue'
import DatePicker from './DatePicker/DataPickerWrapper.vue'
import DatePickerNew from './DatePickerNew/DataPickerWrapper.vue'
import Details from './Details/Details.vue'
import Editor from './Editor/Editor.vue'
import FilePreivew from './FilePreivew/FilePreivew.vue'
import FilesUpload from './FilesUpload/FilesUpload.vue'
import FilesUploadNew from './FilesUploadNew/FilesUpload.vue'
import FormFieldLabel from './FormFieldLabel/FormFieldLabel.vue'
import HexAddress from './HexAddress/HexAddress.vue'
import HiddenText from './HiddenText/HiddenText.vue'
import Icon from './Icon/Icon.vue'
import IconButton from './IconButton/IconButton.vue'
import ImageCropper from './ImageCropper/ImageCropperWrapper.vue'
import InfoMessage from './InfoMessage/InfoMessage.vue'
import Input from './Input/Input.vue'
import InputNew from './InputNew/InputNew.vue'
import InputSearch from './InputSearch/InputSearch.vue'
import LazyModal from './LazyModal/LazyModal.vue'
import Link from './Link/Link.vue'
import Loader from './Loader/Loader.vue'
import LoaderNew from './LoaderNew/LoaderNew.vue'
import Menu from './Menu/Menu.vue'
import MenuNew from './MenuNew/MenuNew.vue'
import Modal from './Modal/Modal.vue'
import ModalNew from './ModalNew/Modal.vue'
// import NotFound from './NotFound/NotFound.vue'
import NumericInput from './NumericInput/NumericInput.vue'
import NumericInputNew from './NumericInputNew/NumericInput.vue'
import PacmanLoader from './PacmanLoader/PacmanLoader.vue'
import PacmanLoaderNew from './PacmanLoaderNew/PacmanLoaderNew.vue'
import Paginate from './Paginate/Paginate.vue'
import PaginateNew from './PaginateNew/Paginate.vue'
import Radio from './Radio/Radio.vue'
import RadioNew from './RadioNew/Radio.vue'
import Rating from './Rating/Rating.vue'
import RatingNew from './RatingNew/Rating.vue'
import Select from './Select/Select.vue'
import SelectNew from './SelectNew/SelectNew.vue'
import SelectNewest from './SelectNewest/Select.vue'
import SkeletonLoader from './SkeletonLoader/SkeletonLoader.vue'
import Slider from './Slider/Slider.vue'
import SomeError from './SomeError/SomeError.vue'
import ShareThisSocials from './ShareThisSocials/ShareThisSocials.vue'
import Stepper from './Stepper/Stepper.vue'
import Swiper from './Swiper/Swiper.vue'
import Switch from './Switch/Switch.vue'
import SwitchNew from './SwitchNew/SwitchNew.vue'
import Tab from './Tabs/Tab/Tab.vue'
import Tabs from './Tabs/Tabs.vue'
import NoContent from './NoContent/NoContent.vue'
import NewTab from './NewTabs/Tab/Tab.vue'
import NewTabs from './NewTabs/Tabs.vue'
import NewestTab from './NewestTabs/Tab/Tab.vue'
import NewestTabs from './NewestTabs/Tabs.vue'
import StatusBadge from './StatusBadge/StatusBadge.vue'
import TagCloudy from './TagCloudy/TagCloudy.vue'
import TagCloudyNew from './TagCloudyNew/TagCloudy.vue'
import Textarea from './Textarea/Textarea.vue'
import TextareaNew from './TextareaNew/Textarea.vue'
import Tooltip from './Tooltip/Tooltip.vue'
import ValidationError from './ValidationError/ValidationError.vue'
import VacancyDetailsLink from './VacancyDetailsLink/VacancyDetailsLink.vue'

const components = {
    AddThis,
    AddThisNew,
    Avatar,
    BackLink,
    Breadcrumbs,
    BreadcrumbsNew,
    Button,
    ButtonNew,
    ButtonPrivate,
    Checkbox,
    CopiedBlock,
    DatePicker,
    DatePickerNew,
    Details,
    Editor,
    Icon,
    IconButton,
    ImageCropper,
    InfoMessage,
    Input,
    InputNew,
    InputSearch,
    FilePreivew,
    FilesUpload,
    FilesUploadNew,
    FormFieldLabel,
    HexAddress,
    HiddenText,
    LazyModal,
    Link,
    Loader,
    LoaderNew,
    Menu,
    MenuNew,
    Modal,
    ModalNew,
    NoContent,
    // NotFound,
    NumericInput,
    NumericInputNew,
    PacmanLoader,
    PacmanLoaderNew,
    Paginate,
    PaginateNew,
    Radio,
    RadioNew,
    Rating,
    RatingNew,
    Select,
    SelectNew,
    SelectNewest,
    SkeletonLoader,
    Slider,
    SomeError,
    StatusBadge,
    ShareThisSocials,
    Swiper,
    Switch,
    SwitchNew,
    Tab,
    Tabs,
    NewTab,
    NewTabs,
    NewestTab,
    NewestTabs,
    Stepper,
    TagCloudy,
    TagCloudyNew,
    Textarea,
    TextareaNew,
    Tooltip,
    ValidationError,
    VacancyDetailsLink,
    CheckboxNew,
}

export default {
    ...components,
    install: install(components),
}
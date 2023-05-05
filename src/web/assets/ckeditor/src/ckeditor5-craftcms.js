import './ckeditor5-craftcms.css';
import {Alignment} from '@ckeditor/ckeditor5-alignment';
import {
  AutoImage,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
} from '@ckeditor/ckeditor5-image';
import {Autoformat} from '@ckeditor/ckeditor5-autoformat';
import {BlockQuote} from '@ckeditor/ckeditor5-block-quote';
import {
  Bold,
  Code,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from '@ckeditor/ckeditor5-basic-styles';
import {ClassicEditor} from '@ckeditor/ckeditor5-editor-classic';
import {CodeBlock} from '@ckeditor/ckeditor5-code-block';
import {Essentials} from '@ckeditor/ckeditor5-essentials';
import {FindAndReplace} from '@ckeditor/ckeditor5-find-and-replace';
import {Font} from '@ckeditor/ckeditor5-font';
import {
  GeneralHtmlSupport,
  HtmlComment,
} from '@ckeditor/ckeditor5-html-support';
import {Heading} from '@ckeditor/ckeditor5-heading';
import {HorizontalLine} from '@ckeditor/ckeditor5-horizontal-line';
import {HtmlEmbed} from '@ckeditor/ckeditor5-html-embed';
import {Indent} from '@ckeditor/ckeditor5-indent';
import {LinkEditing, AutoLink, LinkImage} from '@ckeditor/ckeditor5-link';
import {List, ListProperties, TodoList} from '@ckeditor/ckeditor5-list';
import {MediaEmbed, MediaEmbedToolbar} from '@ckeditor/ckeditor5-media-embed';
import {PageBreak} from '@ckeditor/ckeditor5-page-break';
import {PasteFromOffice} from '@ckeditor/ckeditor5-paste-from-office';
import {SourceEditing} from '@ckeditor/ckeditor5-source-editing';
import {Style} from '@ckeditor/ckeditor5-style';
import {
  Table,
  TableCaption,
  TableToolbar,
  TableUI,
} from '@ckeditor/ckeditor5-table';
import {WordCount} from '@ckeditor/ckeditor5-word-count';
import {default as CraftLinkUI} from './plugins/linkui';
import {default as CraftImageInsertUI} from './plugins/imageinsertui';

const allPlugins = [
  Alignment,
  AutoImage,
  AutoLink,
  Autoformat,
  BlockQuote,
  Bold,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  Font,
  GeneralHtmlSupport,
  Heading,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  Indent,
  Italic,
  LinkEditing,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  MediaEmbedToolbar,
  PageBreak,
  PasteFromOffice,
  SourceEditing,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableToolbar,
  TableUI,
  TodoList,
  Underline,
  WordCount,
  CraftImageInsertUI,
  CraftLinkUI,
];

const pluginButtonMap = [
  {plugins: ['Alignment'], buttons: ['alignment']},
  {
    plugins: [
      'AutoImage',
      'CraftImageInsertUI',
      'Image',
      'ImageCaption',
      'ImageStyle',
      'ImageToolbar',
      'LinkImage',
    ],
    buttons: ['insertImage'],
  },
  {
    plugins: ['AutoLink', 'CraftLinkUI', 'LinkEditing', 'LinkImage'],
    buttons: ['link'],
  },
  {plugins: ['BlockQuote'], buttons: ['blockQuote']},
  {plugins: ['Bold'], buttons: ['bold']},
  {plugins: ['Code'], buttons: ['code']},
  {plugins: ['CodeBlock'], buttons: ['codeBlock']},
  {
    plugins: ['Font'],
    buttons: ['fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor'],
  },
  {plugins: ['FindAndReplace'], buttons: ['findAndReplace']},
  {plugins: ['Heading'], buttons: ['heading']},
  {plugins: ['HorizontalLine'], buttons: ['horizontalLine']},
  {plugins: ['HtmlEmbed'], buttons: ['htmlEmbed']},
  {
    plugins: ['Indent'],
    buttons: ['outdent', 'indent'],
  },
  {plugins: ['Italic'], buttons: ['italic']},
  {
    plugins: ['List', 'ListProperties'],
    buttons: ['bulletedList', 'numberedList'],
  },
  {
    plugins: ['MediaEmbed', 'MediaEmbedToolbar'],
    buttons: ['mediaEmbed'],
  },
  {plugins: ['PageBreak'], buttons: ['pageBreak']},
  {plugins: ['SourceEditing'], buttons: ['sourceEditing']},
  {plugins: ['Strikethrough'], buttons: ['strikethrough']},
  {plugins: ['Style'], buttons: ['style']},
  {plugins: ['Subscript'], buttons: ['subscript']},
  {plugins: ['Superscript'], buttons: ['superscript']},
  {
    plugins: ['Table', 'TableCaption', 'TableToolbar', 'TableUI'],
    buttons: ['insertTable'],
  },
  {plugins: ['TodoList'], buttons: ['todoList']},
  {plugins: ['Underline'], buttons: ['underline']},
];

const trackChangesInSourceMode = function (editor) {
  const sourceEditing = editor.plugins.get(SourceEditing);
  const $editorElement = $(editor.ui.view.element);
  const $sourceElement = $(editor.sourceElement);
  const ns = `ckeditor${Math.floor(Math.random() * 1000000000)}`;
  const events = [
    'keypress',
    'keyup',
    'change',
    'focus',
    'blur',
    'click',
    'mousedown',
    'mouseup',
  ]
    .map((type) => `${type}.${ns}`)
    .join(' ');

  sourceEditing.on('change:isSourceEditingMode', () => {
    const $sourceEditingContainer = $editorElement.find(
      '.ck-source-editing-area'
    );

    if (sourceEditing.isSourceEditingMode) {
      let content = $sourceEditingContainer.attr('data-value');
      $sourceEditingContainer.on(events, () => {
        if (
          content !== (content = $sourceEditingContainer.attr('data-value'))
        ) {
          $sourceElement.val(content);
        }
      });
    } else {
      $sourceEditingContainer.off(`.${ns}`);
    }
  });
};

export const pluginNames = allPlugins.map((p) => p.pluginName);

export const create = async function (element, config) {
  let plugins = allPlugins;

  if (config.toolbar) {
    // Remove any plugins that aren't included in the toolbar
    const removePlugins = pluginButtonMap
      .filter(
        ({buttons}) =>
          !config.toolbar.some((button) => buttons.includes(button))
      )
      .map(({plugins}) => plugins)
      .flat();

    plugins = plugins.filter((p) => !removePlugins.includes(p.pluginName));
  }

  if (typeof element === 'string') {
    element = document.querySelector(`#${element}`);
  }

  const editor = await ClassicEditor.create(
    element,
    Object.assign({plugins}, config)
  );

  // Keep the source element updated with changes
  editor.model.document.on('change', () => {
    editor.updateSourceElement();
  });

  // Track changes in the source mode
  if (plugins.includes(SourceEditing)) {
    trackChangesInSourceMode(editor, SourceEditing);
  }

  return editor;
};

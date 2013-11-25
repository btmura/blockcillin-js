#include <string>

#include "GL/glew.h"

#include "glutil.h"
#include "ioutil.h"

const Log GLUtil::log("glutil");

GLuint GLUtil::CreateShader(const GLenum type, const std::string &path) {
  GLuint shader = glCreateShader(type);
  if (shader == 0) {
    log.Errorf("glCreateShader for type %d failed", type);
    return 0;
  }

  std::string source;
  if (!IOUtil::ReadFile(path, &source)) {
    log.Errorf("ReadFile on %s failed", path.c_str());
    return 0;
  }

  const GLchar* sources[] = {source.c_str()};
  glShaderSource(shader, 1, sources, nullptr);
  glCompileShader(shader);

  GLint success = GL_TRUE;
  glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
  if (success != GL_TRUE) {
    GLint info_log_length;
    glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &info_log_length);

    GLchar *info_log = new GLchar[info_log_length];
    glGetShaderInfoLog(shader, info_log_length, nullptr, info_log);
    log.Errorf("glCompileShader for type %d failed: %s", type, info_log);
    delete[] info_log;

    return 0;
  }

  return shader;
}